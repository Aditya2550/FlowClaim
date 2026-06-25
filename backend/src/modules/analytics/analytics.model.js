import { query } from "../../config/db.js";
import { analyticsQueries } from "../../db/queries/analytics/analytics.queries.js";

export const analyticsModel = {
  byCategory() {
    return query(analyticsQueries.byCategory);
  },
  byUser() {
    return query(analyticsQueries.byUser);
  },
  riskSummary() {
    return query(analyticsQueries.riskSummary);
  }
};
