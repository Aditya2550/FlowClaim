export async function parseReceiptWithOcr(_base64Image) {
  return {
    merchant: "Sample Store",
    amount: 1299.5,
    currency: "INR",
    category: "Travel",
    expenseDate: new Date().toISOString().slice(0, 10)
  };
}
