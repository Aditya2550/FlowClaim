import apiClient from "../../../services/apiClient.js";

export async function myNotificationsApi() {
  const { data } = await apiClient.get("/notifications/me");
  return data;
}

export async function markNotificationReadApi(id) {
  const { data } = await apiClient.patch(`/notifications/${id}/read`);
  return data;
}
