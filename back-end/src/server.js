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
        origin: '*' ,//["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
        credentials: true
    }
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/uploads/users/:folder/:folder2", (req, res, next) => {
    const { folder, folder2 } = res.parmas
    const pathFile = path.join(__dirname, 'uploads/users', folder, folder2)
    express.static(path.join(__dirname, pathFile ))(req, res, next)
})


app.use("/uploads/themes", express.static(path.join(__dirname, 'uploads/themes')))


app.use("/uploads/talsphere/:folder/:folder2", (req, res, next) => {
    const { folder, folder2 } = res.parmas
    const pathFile = path.join(__dirname, 'uploads/talkspheres', folder, folder2 )
    express.static(path.join(__dirname, pathFile ))(req, res, next)
})


const usersRouter = require("./routes/users.routes");
const socketHandlers = require("./socket/socket.handlers")
const talkSphereRouter = require('./routes/talksphere.routes');
const userSettingsRouters = require('./routes/settings.routes');
const userInvitationRouter = require('./routes/invitation.routes');


app.use("/users", usersRouter);
app.use("/talkSphere", talkSphereRouter);
app.use('/settings', userSettingsRouters)
app.use("/invitation", userInvitationRouter)


io.on("connection", (socket) => socketHandlers(socket, io));


server.listen(PORT, () => {
    console.log("Server started on port 3000");
});

