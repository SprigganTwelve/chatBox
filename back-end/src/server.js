
//---port

const API_PORT = 3000
const users = new Map()

//--- library import

const http = require('http');
const cors = require('cors');
const path = require('path');

const express = require('express');
const { Server } = require("socket.io");
const { unless } = require('express-unless')


//----Middleware configuration

const expressJson = express.json({ limit: '22mb' })
const expressUrlencoded = express.urlencoded({ extended: true, limit: '22mb' })

expressJson.unless = unless  //GB it will help use to disable the bodyParse or expressJson middleware to some specific route

expressUrlencoded.unless = unless

//---- Server Creating and initializing 

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*' ,//["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
        credentials: true
    }
});


//--- Global App variables

app.set( 'io', io )


//----Global Middelwares

const expressJsonDisablePath = [
    { url: '/talkSphere/messages/:talksphereId/:talkSphereFolder/sendFiles', methods: ['POST'] }
]

app.use(cors());
app.use(expressJson.unless({ path: expressJsonDisablePath }));
app.use(expressUrlencoded.unless({ path: expressJsonDisablePath }));


//---controller


const usersRouter = require("./routes/users.routes");
const socketHandlers = require("./socket/socket.handlers")
const talkSphereRouter = require('./routes/talksphere.routes');
const userSettingsRouters = require('./routes/settings.routes');
const userInvitationRouter = require('./routes/invitation.routes');
const fileProvider = require('./routes/files.provider.routes')


//-----routes/controllers


app.use("/users", usersRouter);
app.use("/uploads", fileProvider)
app.use("/talkSphere", talkSphereRouter);
app.use('/settings', userSettingsRouters)
app.use("/invitation", userInvitationRouter)


//----statics 

app.use("/uploads/themes", express.static(path.join(__dirname, 'uploads/themes')))

//----socket

io.on("connection", (socket) => socketHandlers(socket, io, users));


//----listening

server.listen( API_PORT, () => {
    console.log("Server started on port 3000");
});

//---export module 

module.exports = app