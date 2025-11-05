const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "please enter your name"],
    },
    email:{
        type: String,
        required: [true, "please enter your email"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "please enter your password"]
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user",
    }
},{timestamps: true});


module.exports = mongoose.model("User", userSchema);