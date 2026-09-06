import { asyncHandler } from "../../utils/asyncHandler.js";
import { analyticsModel } from "./analytics.model.js";

export const summary = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;
  const [
    byCategory,
    byUser,
    risk,
    turnaround,
    riskTrend,
    approvalRate,
    monthlyVelocity,
  ] = await Promise.all([
    analyticsModel.byCategory(companyId),
    analyticsModel.byUser(companyId),
    analyticsModel.riskSummary(companyId),
    analyticsModel.turnaroundTime(companyId),
    analyticsModel.riskTrend(companyId),
    analyticsModel.approvalRate(companyId),
    analyticsModel.monthlyVelocity(companyId),
  ]);
  res.json({
    byCategory: byCategory.rows,
    byUser: byUser.rows,
    risk: risk.rows,
    turnaround: turnaround.rows[0],
    riskTrend: riskTrend.rows,
    approvalRate: approvalRate.rows,
    monthlyVelocity: monthlyVelocity.rows,
  });
});
