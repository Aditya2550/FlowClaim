import api from "./axios";

export async function scanReceipt(file) {
  const formData = new FormData();
  formData.append("receipt", file);

  const { data } = await api.post("/expenses/ocr", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data;
}
