import api from "./axios";

export async function getAnalytics() {
    const { data } = await api.get("/analytics/summary");
    return data;
}
