import { useState } from "react";
import { Upload, ArrowUpCircle, Plus, FileSearch } from "lucide-react";
import ExpenseForm from "./ExpenseForm.jsx";
import RecentSpendingCards from "./RecentSpendingCards.jsx";
import ExpenseList from "./ExpenseList.jsx";

export default function EmployeeDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="font-manrope font-bold text-2xl text-forest-900">
          Reimbursements
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Submit, track, and manage your expense claims
        </p>
      </div>

      {/* OCR Drop Zone */}
      <DropZone />

      {/* Recent Spending */}
      <RecentSpendingCards />

      {/* Expense Ledger */}
      <ExpenseList refreshKey={refreshKey} />

      {/* Floating Action Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-neon text-forest-900 flex items-center justify-center transition-all duration-200 hover:scale-110 z-40"
        style={{ boxShadow: "0 4px 20px rgba(0, 255, 102, 0.4)" }}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Expense Form Modal */}
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
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DropZone() {
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    setScanning(true);
    // Simulate OCR scanning
    setTimeout(() => setScanning(false), 3000);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-2xl p-10 text-center transition-all duration-300 overflow-hidden ${
        dragging ? "bg-neon/5 border-neon" : "bg-white"
      }`}
      style={{
        border: dragging
          ? "2px dashed #00FF66"
          : "2px dashed rgba(26, 77, 46, 0.15)",
        boxShadow: "0 1px 3px rgba(26, 77, 46, 0.04)",
      }}
    >
      {scanning && <div className="scanner-line" />}

      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
            scanning ? "bg-neon/10 animate-float" : "bg-surface-100"
          }`}
        >
          {scanning ? (
            <FileSearch className="w-7 h-7 text-neon-700 animate-pulse-slow" />
          ) : (
            <ArrowUpCircle className="w-7 h-7 text-forest-400" />
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

        {!scanning && (
          <div className="flex gap-3 mt-2">
            <button className="btn-neon text-sm !px-5 !py-2.5 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Select Files
            </button>
            <button className="bg-white text-forest-700 font-medium rounded-xl px-5 py-2.5 text-sm ghost-border hover:bg-surface-50 transition-all">
              Bulk Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
