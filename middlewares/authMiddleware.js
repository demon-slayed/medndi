import jwt from 'jsonwebtoken'

export const requireSignIn =async (req, res, next) => {    
    try {
        // const authHeader = req.headers.authorization;
        // const token = authHeader.split(" ")[1];
        console.log("middleware hitted");
        
        const token = req.cookies.authToken;
        // console.log("token is: ", token);
        
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized! No token provided or invalid token."
            })
        }
        const decode =await jwt.verify(token, process.env.JWT_SECRET_KEY);      
        req.user = decode
        next();       
    } catch (error) {      
        return res.status(500).send({
            success: false,
            message: "Server error while verying token",
            error: error
        })
    }
}