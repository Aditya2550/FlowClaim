import { asyncHandler } from "../../utils/asyncHandler.js";
import { scoreExpenseRisk } from "../../services/riskScoring.service.js";

export const score = asyncHandler(async (req, res) => {
  const risk = scoreExpenseRisk(req.body);
  res.json({ risk });
});
