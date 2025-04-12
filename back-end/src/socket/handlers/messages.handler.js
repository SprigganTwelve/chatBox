


module.exports = (socket) => {
    socket.on("privateMessage", ({ senderId, receiverId, talkSphereId, content, createdAt }) => {
        const receiverSocketId = users[receiverId];
        console.log({ senderId, receiverId, talkSphereId, content })
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", { talkSphereId, content, createdAt, senderId });
        }
        socketController.insertIntoMessage({ senderId, talkSphereId, content, createdAt });
    });
}