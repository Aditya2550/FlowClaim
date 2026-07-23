import { asyncHandler } from "../../utils/asyncHandler.js";
import { analyticsModel } from "./analytics.model.js";

export const summary = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;
  const [byCategory, byUser, risk] = await Promise.all([
    analyticsModel.byCategory(companyId),
    analyticsModel.byUser(companyId),
    analyticsModel.riskSummary(companyId),
  ]);
  res.json({
    byCategory: byCategory.rows,
    byUser: byUser.rows,
    risk: risk.rows,
  });
});
