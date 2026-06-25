export const userQueries = {
  listUsers: "SELECT id, name, email, role FROM users ORDER BY created_at DESC",
  updateRole: "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role"
};
