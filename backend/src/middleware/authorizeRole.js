import { authorize } from "./authorize.js";

export const authorizeRole = (...allowed) => authorize(...allowed);
