import apiClient from "../../../services/apiClient.js";

export async function loginApi(payload) {
    const { data } = await apiClient.post("/auth/login", payload);
    return data;
}

export async function signupApi(payload) {
    const { data } = await apiClient.post("/auth/signup", payload);
    return data;
}

export async function bootstrapCompanyApi(payload) {
    const { data } = await apiClient.post("/companies/bootstrap", payload);
    return data;
}
