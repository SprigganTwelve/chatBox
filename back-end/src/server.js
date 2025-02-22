const PORT = 3000
const http = require('http');
const cors = require('cors');
const express = require('express');
const { Server } = require("socket.io");
const path = require('path')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"],
        credentials: true
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, 'uploads')))

const usersRouter = require("./routes/users.routes");
const talkSphereRouter = require('./routes/talksphere.routes');
const userInvitationRouter = require('./routes/invitation.routes')

app.use("/users", usersRouter);
app.use("/talkSphere", talkSphereRouter);
app.use("/invitation", userInvitationRouter)

const socketController = require("./controller/socket.controller");
const users = {};

io.on("connection", (socket) => {
    console.log(`L'user ${socket.id} est connecté`);

    socket.on("register", ({ userId }) => {
        users[userId] = socket.id;
        console.log(`Utilisateur enregistré : userId=${userId}, socketId=${socket.id}`);
    });

    socket.on("privateMessage", ({ senderId, receiverId, talkSphereId, content, createdAt }) => {
        const receiverSocketId = users[receiverId];
        console.log({ senderId, receiverId, talkSphereId, content })
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", { talkSphereId, content, createdAt });
        }
        socketController.insertIntoMessage({ senderId, talkSphereId, content, createdAt });
    });

    socket.on('disconnect', () => {
        console.log(`Utilisateur déconnecté : ${socket.id}`);
        Object.keys(users).forEach(userId => {
            if (users[userId] === socket.id) {
                delete users[userId];
            }
        });
    });
});

server.listen(PORT, () => {
    console.log("Server started on port 3000");
});
