# Naming Conventions

## Backend

- modules: kebab-case folders, `*.model.js`, `*.controller.js`, `*.routes.js`
- db queries: grouped by domain in `src/db/queries/<domain>/<domain>.queries.js`
- services: `<feature>.service.js`
- middleware: verb-first names (`authenticate.js`, `authorizeRole.js`)

## Frontend

- pages: `PascalCasePage.jsx`
- components: `PascalCase.jsx`
- hooks: `useXxx.js`
- services: `<feature>.api.js`
- feature folders: singular lowercase (`auth`, `expense`, `approval`)

## Shared

- constants in UPPER_SNAKE_CASE
- role enums: `ADMIN`, `MANAGER`, `EMPLOYEE`
