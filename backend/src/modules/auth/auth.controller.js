import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { query } from "../../config/db.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authModel } from "./auth.model.js";
import { randomUUID } from "crypto";
import { redis } from "../../config/redis.js";

function signAuthToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      companyId: user.company_id,
      jti: randomUUID(),
    },
    env.JWT_SECRET,
    { expiresIn: "15m" },
  );
}

function signRefreshToken(user) {
  const jti = randomUUID();
  const token = jwt.sign({ userId: user.id, jti }, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { token, jti };
}

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV !== "development",
  sameSite: "lax",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

async function issueTokens(res, user) {
  const accessToken = signAuthToken(user);
  const { token: refreshToken, jti } = signRefreshToken(user);

  await redis.set(`refresh:${user.id}:${jti}`, "valid", {
    ex: 7 * 24 * 60 * 60,
  });
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  return accessToken;
}

// New code up here

async function detectCountryCode(countryCodeFromRequest) {
  if (countryCodeFromRequest) return countryCodeFromRequest.toUpperCase();

  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    if (data?.country_code) return String(data.country_code).toUpperCase();
  } catch {
    // Fall through to default.
  }

  return "US";
}

async function countryInfo(countryCode) {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/alpha/${countryCode}`,
    );
    const data = await res.json();
    const country = Array.isArray(data) ? data[0] : null;
    const currencies = country?.currencies
      ? Object.keys(country.currencies)
      : [];
    return {
      countryCode: country?.cca2 || countryCode,
      currency: currencies[0] || "USD",
    };
  } catch {
    return { countryCode, currency: "USD" };
  }
}

export const register = asyncHandler(async (req, res) => {
  const {
    companyName,
    name,
    email,
    password,
    countryCode: requestedCountryCode,
  } = req.body;

  const existing = await authModel.findByEmail(email);
  if (existing.rows[0]) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const countryCode = await detectCountryCode(requestedCountryCode);
  const country = await countryInfo(countryCode);
  const passwordHash = await bcrypt.hash(password, 10);

  await query("BEGIN");
  try {
    const company = await authModel.createCompany({
      name: companyName,
      currency: country.currency,
      countryCode: country.countryCode,
    });

    const admin = await authModel.createAdmin({
      companyId: company.rows[0].id,
      name,
      email,
      passwordHash,
    });

    await query("COMMIT");

    const token = await issueTokens(res, admin.rows[0]);
    return res.status(201).json({
      token,
      company: company.rows[0],
      user: admin.rows[0],
    });
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authModel.findByEmail(email);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = await issueTokens(res, user);
  res.json({
    token,
    user: {
      id: user.id,
      companyId: user.company_id,
      name: user.name,
      email: user.email,
      role: user.role,
      managerId: user.manager_id,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    const decoded = jwt.decode(token);
    if (decoded?.jti && decoded?.exp) {
      const ttlSeconds = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttlSeconds > 0) {
        await redis.set(`blacklist:${decoded.jti}`, "true", { ex: ttlSeconds });
      }
    }
  }

  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
      await redis.del(`refresh:${decoded.userId}:${decoded.jti}`);
    } catch {
      // already invalid/expired — nothing to clean up
    }
  }
  res.clearCookie("refreshToken", { path: "/api/auth" });

  res.json({ message: "Logged out successfully" });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  const key = `refresh:${decoded.userId}:${decoded.jti}`;
  const valid = await redis.get(key);
  if (!valid) return res.status(401).json({ message: "Refresh token revoked" });

  const profile = await authModel.findById(decoded.userId);
  const user = profile.rows[0];
  if (!user) return res.status(401).json({ message: "User not found" });

  const accessToken = signAuthToken(user);
  res.json({ token: accessToken });
});

export const me = asyncHandler(async (req, res) => {
  const profile = await authModel.findById(req.user.userId);
  const user = profile.rows[0];
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
});
