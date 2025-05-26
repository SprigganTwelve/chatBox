
const users = require("../global/constants") 
const messagesHandler = require("./handlers/messages.handler")

module.exports = (socket, io) => {
    console.log(`L'user ${socket.id} est connecté`);

    socket.on("register", ({ userId }) => {
        users.set(userId.toString(), socket.id) ;
        console.log(`Utilisateur enregistré : userId=${userId}, socketId=${socket.id}, userRegister: ${users.get(userId)}`);
        console.log(users)
    });


    messagesHandler(socket, io)

    
    socket.on('disconnect', () => {
        console.log(`Utilisateur déconnecté : ${socket.id}`);
        
        for (const [userId, socketId] of users.entries()) {
            if (socketId === socket.id) {
                users.delete(userId);
                break;
            }
        }
    });
}