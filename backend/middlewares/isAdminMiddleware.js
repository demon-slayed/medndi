import User from "../models/userModel.js";

export const isAdmin = async (req, res, next) => {
    try {
       const { user_id } = req.user;
       const user = await User.findOne({user_id});       
       if(!user){
         return res.status(401).json({
            success: false,
            message: "Unauthorized! No user found."
         })
       }
       if(user?.role!=='Admin'){
          return res.status(403).json({
            success: false,
            message: "Access denied! Admins only."
          })
       }
       next();  // if Admin

    } catch (error) {
       return res.status(500).send({
           success: false,
           message: "Server error while verifying Admin status",
           error: error
       })
    }
}