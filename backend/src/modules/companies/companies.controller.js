import bcrypt from "bcryptjs";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { companiesModel } from "./companies.model.js";
import { query } from "../../config/db.js";

async function countryToCurrency(countryCode) {
  const res = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
  const data = await res.json();
  const currencies = data?.[0]?.currencies || {};
  return Object.keys(currencies)[0] || "USD";
}

export const bootstrapCompanyAndAdmin = asyncHandler(async (req, res) => {
  const existing = await companiesModel.firstCompany();
  if (existing.rows[0]) return res.status(409).json({ message: "Company already initialized" });

  const { companyName, countryCode, adminName, adminEmail, adminPassword } = req.body;
  const defaultCurrency = await countryToCurrency(countryCode);

  const company = await companiesModel.createCompany({ name: companyName, countryCode, defaultCurrency });
  const hash = await bcrypt.hash(adminPassword, 10);
  const user = await query(
    "INSERT INTO users (company_id, full_name, email, password_hash, role) VALUES ($1,$2,$3,$4,'ADMIN') RETURNING id, full_name, email, role",
    [company.rows[0].id, adminName, adminEmail, hash]
  );

  res.status(201).json({ company: company.rows[0], admin: user.rows[0] });
});
