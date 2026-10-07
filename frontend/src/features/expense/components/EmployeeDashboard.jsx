import { useRef, useState } from "react";
import { Upload, ArrowUpCircle, Plus, FileSearch } from "lucide-react";
import ExpenseForm from "./ExpenseForm.jsx";
import RecentSpendingCards from "./RecentSpendingCards.jsx";
import ExpenseList from "./ExpenseList.jsx";
import { scanReceipt } from "../../../api/ocrService.js";

export default function EmployeeDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [prefillData, setPrefillData] = useState(null);

  function openFormWithData(data) {
    setPrefillData(data);
    setShowForm(true);
  }

  function openEmptyForm() {
    setPrefillData(null);
    setShowForm(true);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-manrope font-bold text-2xl text-forest-900">
          Reimbursements
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Submit, track, and manage your expense claims
        </p>
      </div>

      <DropZone onExtracted={openFormWithData} />

      <RecentSpendingCards />

      <ExpenseList refreshKey={refreshKey} />

      <button
        onClick={openEmptyForm}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-neon text-forest-900 flex items-center justify-center transition-all duration-200 hover:scale-110 z-40"
        style={{ boxShadow: "0 4px 20px rgba(0, 255, 102, 0.4)" }}
      >
        <Plus className="w-6 h-6" />
      </button>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{
            background: "rgba(10, 37, 21, 0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in p-6"
            style={{ boxShadow: "0 8px 32px rgba(26, 77, 46, 0.12)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-manrope font-bold text-xl text-forest-900">
                New Expense
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-surface-400 hover:text-forest-600 p-2 rounded-xl hover:bg-surface-100 transition-colors"
              >
                ✕
              </button>
            </div>
            <ExpenseForm
              onClose={() => setShowForm(false)}
              onSubmitted={() => setRefreshKey((prev) => prev + 1)}
              initialData={prefillData}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DropZone({ onExtracted }) {
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const fileInputRef = useRef(null);

  async function processFile(file) {
    if (!file) return;
    setScanError("");
    setScanning(true);
    try {
      const extracted = await scanReceipt(file);
      setScanning(false);
      onExtracted({
        title: extracted?.vendor ? `${extracted.vendor} receipt` : "",
        amount: extracted?.amount ? String(extracted.amount) : "",
        currency: extracted?.currency
          ? String(extracted.currency).toUpperCase()
          : "USD",
        vendor: extracted?.vendor || "",
        date: extracted?.date || new Date().toISOString().split("T")[0],
        category: extracted?.category || "Travel",
        gst: extracted?.gst ? String(extracted.gst) : "",
        invoice_number: extracted?.invoiceNumber || "",
        payment_method: extracted?.paymentMethod || "",
      });
    } catch {
      setScanning(false);
      setScanError("Receipt scan failed. Try again or fill the form manually.");
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    processFile(file);
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    processFile(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-3xl p-12 text-center transition-all duration-300 overflow-hidden cursor-pointer group ${
        dragging ? "bg-emerald-50/50 border-emerald-400 shadow-emerald-500/10" : "bg-white hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5"
      }`}
      style={{
        border: dragging
          ? "2px dashed #34D399"
          : "2px dashed rgba(26, 77, 46, 0.2)",
        boxShadow: dragging ? "0 8px 32px rgba(16, 185, 129, 0.1)" : "0 4px 20px rgba(26, 77, 46, 0.04)",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />
      {scanning && <div className="scanner-line" />}

      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
            scanning ? "bg-emerald-100 animate-float" : "bg-forest-50 group-hover:bg-forest-100 group-hover:scale-110"
          }`}
        >
          {scanning ? (
            <FileSearch className="w-8 h-8 text-emerald-600 animate-pulse-slow" />
          ) : (
            <ArrowUpCircle className="w-8 h-8 text-forest-600 group-hover:text-forest-800 transition-colors" />
          )}
        </div>

        <div>
          <h3 className="font-manrope font-bold text-lg text-forest-900">
            {scanning ? "Analyzing receipt..." : "Drop receipt to analyze"}
          </h3>
          <p className="text-sm text-surface-500 mt-1 max-w-md mx-auto">
            {scanning
              ? "Our AI engine is extracting vendor, date, and amounts"
              : "Our AI engine will automatically extract vendor, date, and amounts in real-time."}
          </p>
        </div>

        {scanError && <p className="text-sm text-red-600">{scanError}</p>}

        {!scanning && (
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-forest-900 text-white hover:bg-forest-800 hover:shadow-xl hover:shadow-forest-900/20 active:scale-95 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              Select Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
