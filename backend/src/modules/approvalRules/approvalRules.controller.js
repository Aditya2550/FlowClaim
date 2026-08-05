import { asyncHandler } from "../../utils/asyncHandler.js";
import { approvalRulesModel } from "./approvalRules.model.js";

const VALID_TYPES = ["sequential", "percentage", "hybrid"];

export const getCurrentRule = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;
  const result = await approvalRulesModel.getLatestByCompany(companyId);

  if (!result.rows[0]) {
    return res.status(404).json({ message: "No approval rule configured" });
  }

  res.json(result.rows[0]);
});

export const getRuleHistory = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;
  const result = await approvalRulesModel.getHistoryByCompany(companyId);
  res.json(result.rows);
});

export const saveRule = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;
  const { type, config } = req.body;

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({
      message: `type must be one of: ${VALID_TYPES.join(", ")}`,
    });
  }

  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return res.status(400).json({ message: "config must be an object" });
  }

  const result = await approvalRulesModel.create({ companyId, type, config });
  res.status(201).json(result.rows[0]);
});
