import api from "./axios";

export async function getUsers() {
    const { data } = await api.get("/users");
    return data;
}

export async function createUser(payload) {
    const { data } = await api.post("/users", payload);
    return data;
}

export async function updateRole(id, payload) {
    const { data } = await api.patch(`/users/${id}/role`, payload);
    return data;
}

export async function assignManager(id, payload) {
    const { data } = await api.post(`/users/${id}/manager`, payload);
    return data;
}
