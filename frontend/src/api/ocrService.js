import api from "./axios";

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = String(reader.result || "");
            const base64 = result.includes(",") ? result.split(",")[1] : result;
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function scanReceipt(file) {
    const fileBase64 = await fileToBase64(file);
    const { data } = await api.post("/expenses/ocr", { fileBase64 });
    return data;
}
