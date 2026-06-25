import apiClient from "../../../services/apiClient.js";

export async function approvalQueueApi() {
    const { data } = await apiClient.get("/approvals/queue");
    return data;
}

export async function approvalActionApi(expenseId, payload) {
    const { data } = await apiClient.post(`/approvals/${expenseId}/action`, payload);
    return data;
}

export async function breadcrumbApi(expenseId) {
    const { data } = await apiClient.get(`/approvals/${expenseId}/breadcrumbs`);
    return data;
}
