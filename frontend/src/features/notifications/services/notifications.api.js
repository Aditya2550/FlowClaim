import apiClient from "../../../services/apiClient.js";

export async function myNotificationsApi() {
    const { data } = await apiClient.get("/notifications/me");
    return data;
}
