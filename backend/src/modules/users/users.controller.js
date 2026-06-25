import { asyncHandler } from "../../utils/asyncHandler.js";
import { usersModel } from "./users.model.js";

export const listUsers = asyncHandler(async (_req, res) => {
  const data = await usersModel.list();
  res.json({ users: data.rows });
});

export const switchRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;
  const data = await usersModel.updateRole(role, id);
  res.json({ user: data.rows[0] });
});
