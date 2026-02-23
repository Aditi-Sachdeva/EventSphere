
function checkRole(allowedRoles){

    return (req,res,next) => {

        if(!req.user || !allowedRoles.includes(req.user.role)){
            return res.status(403).json({ msg : "Access Denied"});
        }

        next();
    }
}

module.exports = {
    checkRole
};