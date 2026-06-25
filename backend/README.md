# Backend (Express + PostgreSQL)

## Architecture
- Strict MVC in `src/modules/*`
- SQL isolated in `src/db/queries/*`
- External/business integrations in `src/services/*`
- Auth/RBAC/errors in `src/middleware/*`
- Socket events in `src/sockets/*`

## Feature Endpoints
- Setup wizard bootstrap: `POST /api/v1/companies/bootstrap`
- Auth login: `POST /api/v1/auth/login`
- Expense create (multi-currency): `POST /api/v1/expenses`
- OCR parse: `POST /api/v1/expenses/ocr`
- Approval queue: `GET /api/v1/approvals/queue`
- Approval action: `POST /api/v1/approvals/:expenseId/action`
- Rule builder: `PUT /api/v1/workflows/rules`
- Role switch: `PATCH /api/v1/users/:id/role`
- Analytics: `GET /api/v1/analytics/summary`
