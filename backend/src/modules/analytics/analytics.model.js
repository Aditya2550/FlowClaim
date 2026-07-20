import { query } from "../../config/db.js";
import { analyticsQueries } from "../../db/queries/analytics/analytics.queries.js";

export const analyticsModel = {
  byCategory(companyId) {
    return query(analyticsQueries.byCategory, [companyId]);
  },
  byUser(companyId) {
    return query(analyticsQueries.byUser, [companyId]);
  },
  riskSummary(companyId) {
    return query(analyticsQueries.riskSummary, [companyId]);
  },
};
