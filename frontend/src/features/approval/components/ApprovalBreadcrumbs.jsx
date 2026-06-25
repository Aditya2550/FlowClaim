import ApprovalStepper from "./ApprovalStepper.jsx";

export default function ApprovalBreadcrumbs({ steps = [] }) {
  return <ApprovalStepper steps={steps} variant="mini" />;
}
