import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) =>{
    const token = req.cookies.token;


    if(!token) {
        return res.status(401).json({ success: false, message: "Unauthorizerd - no token provided"});
    }

    try {
        const decoded = jwt.decode(token, process.env.SECRET_JWT);

        if(!decoded) return res.status(401).json({ success: false, message: "Unauthorizerd - invalid token"});

        req.userId = decoded.userId;
        next();
        
    } catch (error) {
        console.log("Error in verify token ", error);
        return res.status(500).json({success: false, message: error.message})
    }
}