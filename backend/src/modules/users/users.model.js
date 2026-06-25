import { query } from "../../config/db.js";
import { userQueries } from "../../db/queries/users/users.queries.js";

export const usersModel = {
  list() {
    return query(userQueries.listUsers);
  },
  updateRole(role, id) {
    return query(userQueries.updateRole, [role, id]);
  }
};
