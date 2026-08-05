import api from "./axios";

export async function getPending() {
  const { data } = await api.get("/expenses/pending");
  return data?.data || [];
}

export async function getApprovalRules() {
  const { data } = await api.get("/approval-rules");
  return data;
}

export async function saveApprovalRules(payload) {
  const { data } = await api.put("/approval-rules", payload);
  return data;
}
