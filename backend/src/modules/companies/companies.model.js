import { query } from "../../config/db.js";

export const companiesModel = {
  async firstCompany() {
    return query("SELECT id, name, country_code, default_currency FROM companies ORDER BY created_at ASC LIMIT 1");
  },
  async createCompany({ name, countryCode, defaultCurrency }) {
    return query(
      "INSERT INTO companies (name, country_code, default_currency) VALUES ($1,$2,$3) RETURNING *",
      [name, countryCode, defaultCurrency]
    );
  }
};
