import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// register
export const RegisterUser = async (req,res) => {
    try {
        const {name,email,password} = req.body;
        console.log(req.body);

        if (!email || !password || !name) {
            return res.status(400).json({
                message: "All Fields are required"
            })
        }

        const existingUser = await User.findOne({email});

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashPassword = await bcrypt.hash(password,10)

        // create user
         const user = await User.create({
            name,
            email,
            password: hashPassword
        })

        // jwt
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "7d"})

        res.status(201).json({
            success: true,
            message: "User create successfully",
            token,
            user:{
                id: user.id,
                name: user.name,
                email: user.email,
            }
        })
    } catch (error) {
    console.error(error);

    return res.status(500).json({
        message: error.message,
    });
}
}


// login
export const LoginUser = async (req,res) => {
   try {
     const {email,password} = req.body;
     console.log("Body:", req.body);

    if (!email || !password) {
         return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({email})

    if (!user) {
        return res.status(404).json({
            message: 'user not found'
        })
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if (!isMatch) {
      return res.status(401).json({
    message: "Invalid email or password",
    });
    } 

    // token
    const token = jwt.sign(
      {id: user.id},
      process.env.JWT_SECRET,
      {expiresIn: "7d"},  
    )

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
        user:{
             id: user.id,
        name: user.name,
        email: user.email,
    
        }

    })
   } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}