import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            res.status(400).json({ message: "Password must be atleast 6 characters long" });
        }

        const user = await User.findOne({ email })

        if (user) {
            res.status(400).json({ message: "email already exist" });
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        if (newUser) {
            // generate jwt token
            generateToken(newUser._id, res)
            await newUser.save();
            res.status(201).json({ _id: newUser._id, fullName: newUser.fullName, email: newUser.email, profilePic: newUser.profilePic });
        }
    } catch (error) {
        console.log(`error in signup controller ${error.message}`);
        res.status(400).json({ message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateToken(user._id, res);
        return res.status(200).json({ _id: user._id, fullName: user.fullName, email: user.email, profilePic: user.profilePic });
    } catch (error) {
        console.log(`Error in login controller ${error.message}`);
        return res.status(400).json({ message: "Internal Server Error" });

    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(`Error in logout controller ${error.message}`);
        return res.status(400).json({ message: "Internal Server Error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            res.status(400).json({ message: "Profile pic is required" })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log(`Error in update profile controller error:${error}`);
        res.status(400).json({ message: "Failed to update profile picture" });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(`Error in check auth controller error:${error}`);
        res.status(400).json({ message: "Internal Server error" });
    }
}