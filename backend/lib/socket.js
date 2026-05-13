import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["https://whatsupp-frontend.vercel.app"],
        credentials: true
    }
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    }
    socket.on("disconnect", () => {
        delete userSocketMap[userId];
    })
});

export { io, app, server };