import ApprovalQueue from "../features/approval/components/ApprovalQueue.jsx";

export default function ApprovalQueuePage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-manrope font-bold text-2xl text-forest-900">
          Approval Queue
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Review and process pending reimbursement claims
        </p>
      </div>
      <ApprovalQueue />
    </div>
  );
}
