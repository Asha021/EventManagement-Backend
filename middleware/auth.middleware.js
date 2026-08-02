import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req,res,next) => {
  try{
   const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

   if(!token){
    return res.status(401).json({message:"No token provided"});
   }

   const decoded = jwt.verify(token, process.env.JWT_SECRET);

   const user = await User.findById(decoded.id).select("-password");

   if(!user){
    return res.status(404).json({message:"User not found"});
   }
   
     // Save user in request
   req.user = user;
    next();
  }catch(error){
    console.error(error);
    res.status(401).json({message:"Unauthorized"});
  }
}

export default authMiddleware;