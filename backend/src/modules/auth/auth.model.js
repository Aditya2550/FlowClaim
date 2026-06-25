import { query } from "../../config/db.js";
import { authQueries } from "../../db/queries/auth/auth.queries.js";

export const authModel = {
  findByEmail(email) {
    return query(authQueries.findByEmail, [email]);
  },
  findById(id) {
    return query(authQueries.findById, [id]);
  },
  createCompany({ name, currency, countryCode }) {
    return query(authQueries.createCompany, [name, currency, countryCode]);
  },
  createAdmin({ companyId, name, email, passwordHash }) {
    return query(authQueries.createAdmin, [companyId, name, email, passwordHash]);
  }
};
