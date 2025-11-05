const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

//create user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const UserExists = await User.findOne({ email });
        if (UserExists) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),    
        });

    } catch (error) {
        res.status(500).json({message:"Server error"});
    }

}

//login user
const loginUser = async (req,res) => {
    try {
        const {email,password} = req.body;
        const user = User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid email or Password"});

        const isMatch = bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message:"Invalid email or password"});

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        })
        
    } catch (error) {
        res.status(500).json({message:"server error"})
    }
}

//get user profile (protected)
const getUserProfile = async (req, res) => {
    const user  = await User.findById(req.user.id).select("-password");
    if(user){
        res.json(user)
    }
    else{
        res.status(404).json({message:"user not found"});
    }
}


module.exports = {
    registerUser,
    loginUser,
    getUserProfile
}