import { asyncHandler } from "../../utils/asyncHandler.js";
import { workflowsModel } from "./workflows.model.js";

export const upsertRules = asyncHandler(async (req, res) => {
  const { mode, percentage, approvers, managerFirstEnabled } = req.body;
  const rule = { mode, percentage, approvers };
  const result = await workflowsModel.saveRule(rule, managerFirstEnabled);
  res.status(201).json({ rule: result.rows[0] });
});
