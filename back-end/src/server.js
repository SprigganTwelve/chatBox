
const http = require('http')
const cors = require('cors')
const express = require('express')
const { Server } = require("socket.io")

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const allowedOrigins = ["http://localhost:3000","http://localhost:5173"]
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Non autorisé par la politique CORS"));
        }
    },
    credentials: true
};


app.use(express.json())
app.use(cors(corsOptions))

const usersRouter = require("./routes/users.routes")
const talkSphereRouter = require('./routes/talksphere.routes')

app.use("/users", usersRouter )
app.use("/talkSphere", talkSphereRouter )

io.on("connection",( socket )=>{
    console.log('User est bien connecté !!')
    
    io.on("message", () => {

    })


})

server.listen(3000, () => {
    console.log("Server started on port 3000");
});

