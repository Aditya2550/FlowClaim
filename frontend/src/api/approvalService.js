import api from "./axios";

export async function getPending() {
    const { data } = await api.get("/expenses/pending");
    return data?.data || [];
}

export async function saveWorkflowRules(payload) {
    const { data } = await api.put("/workflows/rules", payload);
    return data?.rule || data;
}
