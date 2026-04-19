
const jwt = require("jsonwebtoken");//IMPORT JWT LIBRARY ->CREATE TOKEN AND VERIFY TOKEN WHEN USER LOGS IN

function checkAuth(req,res,next){//MIDDLEWARE FUNCTION  , REQ FROM CLIENT , RESPONSE SENT TO CLIENT , FUNCTION THAT MOVES TO NEXT STEP
    
    try{

        const authHeader = req.headers.authorization;  //EG AUTHORIZATION : BEARER ABC123XYZ

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({ msg : "No token provided"});
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token,process.env.JWT_SECRET); // VERIGY USING SECRET KEY 
        

        req.user = decoded; // payload -> INFO AVAILABLE
        // req.user = decoded; // payload

        req.user = { _id: decoded.id, role: decoded.role };

        next(); // Next Middleware or Route Handler
    }
    catch(error){
        return res.status(401).json({ msg : "Invalid or expired token"});
    }
}

module.exports = { checkAuth };