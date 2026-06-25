import { query } from "../../config/db.js";

export const workflowsModel = {
  saveRule(ruleJson, managerFirstEnabled) {
    return query(
      "INSERT INTO approval_rules (rule_json, manager_first_enabled) VALUES ($1,$2) RETURNING *",
      [ruleJson, managerFirstEnabled]
    );
  }
};
