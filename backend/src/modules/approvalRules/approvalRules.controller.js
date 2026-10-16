import { asyncHandler } from "../../utils/asyncHandler.js";
import { approvalRulesModel } from "./approvalRules.model.js";

const VALID_TYPES = ["sequential", "percentage", "hybrid"];
const APPROVER_ROLES = ["manager", "finance", "director", "cfo", "admin"];

function cleanRole(role) {
  return typeof role === "string" ? role.trim().toLowerCase() : "";
}

function isValidApproverRole(role) {
  return typeof role === "string" && APPROVER_ROLES.includes(cleanRole(role));
}

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

  if (type === "specific") {
    return res.status(400).json({
      message: "Named-approver rules are not supported yet",
    });
  }

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({
      message: `type must be one of: ${VALID_TYPES.join(", ")}`,
    });
  }

  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return res.status(400).json({ message: "config must be an object" });
  }

  let rolesToVerify = [];
  let normalizedConfig = {};

  if (type === "sequential") {
    if (!Array.isArray(config.roles) || config.roles.length === 0) {
      return res.status(400).json({
        message: "config.roles must be a non-empty array of approver roles",
      });
    }

    for (const role of config.roles) {
      if (!isValidApproverRole(role)) {
        return res.status(400).json({
          message: `Invalid approver role "${role}". Allowed roles: ${APPROVER_ROLES.join(", ")}`,
        });
      }
    }

    const normalizedRoles = config.roles.map(cleanRole);
    rolesToVerify = normalizedRoles;
    normalizedConfig = {
      ...config,
      type: "sequential",
      roles: normalizedRoles,
    };
  } else if (type === "percentage") {
    if (!config.approverRole) {
      return res.status(400).json({
        message: "config.approverRole is required",
      });
    }

    if (!isValidApproverRole(config.approverRole)) {
      return res.status(400).json({
        message: `Invalid approver role "${config.approverRole}". Allowed roles: ${APPROVER_ROLES.join(", ")}`,
      });
    }

    if (
      config.threshold === undefined ||
      config.threshold === null ||
      typeof config.threshold !== "number" ||
      Number.isNaN(config.threshold) ||
      config.threshold < 1 ||
      config.threshold > 100
    ) {
      return res.status(400).json({
        message: "config.threshold must be a number between 1 and 100",
      });
    }

    const normalizedRole = cleanRole(config.approverRole);
    rolesToVerify = [normalizedRole];
    normalizedConfig = {
      ...config,
      type: "percentage",
      approverRole: normalizedRole,
      threshold: Number(config.threshold),
    };
  } else if (type === "hybrid") {
    if (!config.overrideRole) {
      return res.status(400).json({
        message: "config.overrideRole is required",
      });
    }

    if (!isValidApproverRole(config.overrideRole)) {
      return res.status(400).json({
        message: `Invalid approver role "${config.overrideRole}". Allowed roles: ${APPROVER_ROLES.join(", ")}`,
      });
    }

    if (
      config.overrideThreshold === undefined ||
      config.overrideThreshold === null ||
      typeof config.overrideThreshold !== "number" ||
      Number.isNaN(config.overrideThreshold) ||
      config.overrideThreshold <= 0
    ) {
      return res.status(400).json({
        message: "config.overrideThreshold must be a number greater than 0",
      });
    }

    if (!Array.isArray(config.defaultFlow) || config.defaultFlow.length === 0) {
      return res.status(400).json({
        message:
          "config.defaultFlow must be a non-empty array of approver roles",
      });
    }

    for (const role of config.defaultFlow) {
      if (!isValidApproverRole(role)) {
        return res.status(400).json({
          message: `Invalid approver role "${role}". Allowed roles: ${APPROVER_ROLES.join(", ")}`,
        });
      }
    }

    const normalizedOverrideRole = cleanRole(config.overrideRole);
    const normalizedDefaultFlow = config.defaultFlow.map(cleanRole);
    rolesToVerify = [normalizedOverrideRole, ...normalizedDefaultFlow];
    normalizedConfig = {
      ...config,
      type: "hybrid",
      overrideRole: normalizedOverrideRole,
      overrideThreshold: Number(config.overrideThreshold),
      defaultFlow: normalizedDefaultFlow,
    };
  }

  const uniqueRoles = [...new Set(rolesToVerify)];
  for (const role of uniqueRoles) {
    const count = await approvalRulesModel.countActiveUsersByRole(
      companyId,
      role,
    );
    if (count === 0) {
      return res.status(400).json({
        message: `No active user with role "${role}". Add or activate one before saving this rule.`,
      });
    }
  }

  const result = await approvalRulesModel.create({
    companyId,
    type,
    config: normalizedConfig,
  });

  res.status(201).json(result.rows[0]);
});
