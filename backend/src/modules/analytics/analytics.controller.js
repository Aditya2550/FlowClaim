import { asyncHandler } from "../../utils/asyncHandler.js";
import { analyticsModel } from "./analytics.model.js";

export const summary = asyncHandler(async (_req, res) => {
  const [byCategory, byUser, risk] = await Promise.all([
    analyticsModel.byCategory(),
    analyticsModel.byUser(),
    analyticsModel.riskSummary()
  ]);
  res.json({ byCategory: byCategory.rows, byUser: byUser.rows, risk: risk.rows });
});
