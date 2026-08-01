import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required:[ true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    role:{
        type: String,
        default: "user",
    },
    
},{timestamps: true})


const User = mongoose.model("User",UserSchema)

export default User;