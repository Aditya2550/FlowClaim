export const authorize = (...allowedRoles) => (req, res, next) => {
    const userRole = String(req.user?.role || "").toLowerCase();
    const allowed = allowedRoles.map((role) => String(role).toLowerCase());
    if (!req.user || !allowed.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};
