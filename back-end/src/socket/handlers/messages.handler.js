
const users = require("../../global/constants")
const socketController = require("../../controller/socket.controller")

module.exports = (socket, io) => {
    socket.on("privateMessage", ({ senderId, receiverId, talkSphereId, content, createdAt }) => {
        const receiverSocketId = users.get(receiverId.toString());
        console.log("receiverSocketId: ", receiverSocketId)
        console.log({ senderId, receiverId, talkSphereId, content })
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", { talkSphereId, content, createdAt, senderId });
            socketController.insertIntoMessage({ senderId, talkSphereId, content, createdAt });
        }
    });
}