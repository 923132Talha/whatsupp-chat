import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import { v2 as cloudinary } from "cloudinary";
import { getReceiverSocketId,io } from "../lib/socket.js"


export const getUsersForSidebar = async (req, res) => {
    try {
        const LoggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: LoggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(`Error in getUsersForSidebar controller error: ${error.message}`);
        res.status(400).json({ error: "Internal Server Error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [{ senderId: myId, receiverId: userToChatId }, { senderId: userToChatId, receiverId: myId }]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log(`Error in getMessages controller error: ${error.message}`);
        res.status(400).json({ error: "Internal Server Error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();

        //socket.io
        const recieverSocketId = getReceiverSocketId(receiverId);
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage);
        }

        

        res.status(200).json(newMessage);

    } catch (error) {
        console.log(`Error in sendMessage controller error: ${error.message}`);
        res.status(400).json({ error: "Internal Server Error" });
    }
}