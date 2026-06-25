import apiClient from "../../../services/apiClient.js";

export async function createExpenseApi(payload) {
    const { data } = await apiClient.post("/expenses", payload);
    return data;
}

export async function listMyExpensesApi() {
    const { data } = await apiClient.get("/expenses/mine");
    return data;
}

export async function ocrReceiptApi(fileBase64) {
    const { data } = await apiClient.post("/expenses/ocr", { fileBase64 });
    return data;
}
