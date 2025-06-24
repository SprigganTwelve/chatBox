

module.exports = (socket, io, users)=>{
    
    socket.on("offer",({ offer, userId, type, iceCandidateArray , senderImageData})=>{
        if( offer && userId && type && iceCandidateArray ){
            const socketId = users.get(userId.toString())
            if(socketId) 
                return socket.to(socketId).emit("offer", { offer, type, iceCandidateArray, senderImageData, userId })
            else
                return socket.emit("offer:err", "The user is not connected" )
        }
        return socket.emit( "offer:err", "The sent object is not correct" )
    })


    socket.on("answer", ({ answer, userId, iceCandidateArray })=>{
        if(answer && userId && iceCandidateArray){
            const socketId = users.get(userId.toString())
            if(socketId)
               return socket.to(socketId).emit("answer", { answer , userId ,iceCandidateArray })
            else
               return socket.emit("answer:err", "The user is not connected" )
        }
        return socket.emit( "answer:err", "The sent object is not correct" )
    })


    socket.on("abortPreConnection", ({ userId })=>{
        if(userId){
            const socketId = users.get(userId.toString())
            if(socketId)
               return socket.to(socketId).emit("abortPreConnection", { userId })
            else
               return socket.emit("abortPreConnection:err", "The user is not connected or registered" )
        }
        return socket.emit( "abortPreConnection:err", "userId field is missing" )
    })

}