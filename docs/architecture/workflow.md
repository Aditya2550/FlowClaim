# Workflow Summary

1. First signup -> `/companies/bootstrap` checks if company exists.
2. No company -> RestCountries resolves default currency -> company + admin created.
3. Employee submits expense in original currency -> backend stores original + converted amount.
4. OCR endpoint extracts fields and pre-fills submission form.
5. Manager-first gate (if enabled) routes to direct manager before normal sequence.
6. Approval steps tracked in `expense_approval_steps` for breadcrumb UI.
7. Status changes emit WebSocket notifications.
8. Analytics endpoint returns grouped SQL aggregates.
