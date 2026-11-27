
function checkRole(allowedRoles = []) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                msg: "Authentication required"
            });
        }

        if (!Array.isArray(allowedRoles) ||
            !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                msg: "Access denied"
            });
        }

        return next();
    };
}

module.exports = { checkRole };
