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




const usersRouter = require("./routes/users.routes");
const socketHandlers = require("./socket/socket.handlers")
const talkSphereRouter = require('./routes/talksphere.routes');
const userSettingsRouters = require('./routes/settings.routes');
const userInvitationRouter = require('./routes/invitation.routes');
const fileProvider = require('./routes/files.provider.routes')


app.use("/users", usersRouter);
app.use("/uploads", fileProvider)
app.use("/talkSphere", talkSphereRouter);
app.use('/settings', userSettingsRouters)
app.use("/invitation", userInvitationRouter)

app.use("/uploads/themes", express.static(path.join(__dirname, 'uploads/themes')))

io.on("connection", (socket) => socketHandlers(socket, io));


server.listen(PORT, () => {
    console.log("Server started on port 3000");
});

