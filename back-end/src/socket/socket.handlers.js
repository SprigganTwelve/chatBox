
const users = require("../global/constants") 
const messagesHandler = require("../socket/handlers/messages.handler")

module.exports = (socket) => {
    console.log(`L'user ${socket.id} est connecté`);

    socket.on("register", ({ userId }) => {
        users[userId] = socket.id;
        console.log(`Utilisateur enregistré : userId=${userId}, socketId=${socket.id}, userRegister: ${users[userId]}`);
    });

    messagesHandler(socket)

    socket.on('disconnect', () => {
        console.log(`Utilisateur déconnecté : ${socket.id}`);
        Object.keys(users).forEach(userId => {
            if (users[userId] === socket.id) {
                delete users[userId];
            }
        });
    });
}