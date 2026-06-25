import apiClient from "../../../services/apiClient.js";

export async function analyticsSummaryApi() {
    const { data } = await apiClient.get("/analytics/summary");
    return data;
}
