import api from "./axios";

export async function getExpenses(params = {}) {
    const { data } = await api.get("/expenses", { params });
    return data?.data || [];
}

export async function getExpenseById(id) {
    try {
        const { data } = await api.get(`/expenses/${id}`);
        return data?.data || data;
    } catch {
        const { data } = await api.get(`/expenses/${id}/approval-status`);
        return data?.data || data;
    }
}

export async function createExpense(payload) {
    const { data } = await api.post("/expenses", payload);
    return data?.data || data;
}

export async function approveExpense(id, payload = {}) {
    const { data } = await api.patch(`/expenses/${id}/approve`, payload);
    return data?.data || data;
}

export async function rejectExpense(id, payload) {
    const { data } = await api.patch(`/expenses/${id}/reject`, payload);
    return data?.data || data;
}
