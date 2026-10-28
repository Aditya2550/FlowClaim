import apiClient from "../../../services/apiClient.js";

export async function myNotificationsApi(params = {}) {
  const { data } = await apiClient.get("/notifications/me", { params });
  return data;
}

export async function markNotificationReadApi(id) {
  const { data } = await apiClient.patch(`/notifications/${id}/read`);
  return data;
}

export async function markAllNotificationsReadApi() {
  const { data } = await apiClient.patch("/notifications/read-all");
  return data;
}

