
const users = require("../../global/constants")
const socketController = require("../../controller/socket.controller")

module.exports = (socket, io) => {
//-----------------

    //Here we make the join to one specific room
    socket.on("JoinRoom", (room)=>{
        try{
            if(!room) {
                socket.emit( { state: false } )
                console.log("[socket: JoinRoom ] missings data")
                return;
            }
            socket.join(room)
            socket.emit("joinRoomResponse", { state: true } )
        }
        catch(err){
            socket.emit("joinRoomResponse", { state: false } )
            console.log("[socket: JoinRoom ] Something went wrong while joining the room ")
        }
    })

    //Here we leave an specific room 

    socket.on("leaveRoom", (room)=> {
        try{
            if(!room) {
                console.log("[socket: JoinRoom ] missings data")
                return;
            }
            socket.leave(room)
        }
        catch(err){
            socket.emit("joinRoomResponse", { state: false } )
            console.log("[socket: leaveRoom ] Something went wrong while leaving the room ")
        }
    })

    //Here we receive and send messages to the client

    socket.on("privateMessage", (message) => {
        try{
            if(!message){
                console.log("[socket: privateMessage ] missings data")
                return;
            }

            socketController.insertIntoMessage(message, io);
            
            for(const id of message.receivers){
                const receiverSocketId = users.get(id.toString());
                if (receiverSocketId) 
                    socket.to(receiverSocketId).emit("incommingMessage", message);
            }
        }
        catch(err){
            console.log("[socket: privateMessage ] Something went wrong while sending the message, error: ", err)
        }
    });

    //Here we receive a  custom object that contains different fiels of files

    socket.on("sendFiles", (files)=>{
        console.log({files})
    })

//---------------------
}