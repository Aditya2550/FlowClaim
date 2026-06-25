import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = {
      userId: decoded.userId || decoded.id,
      id: decoded.userId || decoded.id,
      role: decoded.role,
      companyId: decoded.companyId,
      email: decoded.email
    };
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
