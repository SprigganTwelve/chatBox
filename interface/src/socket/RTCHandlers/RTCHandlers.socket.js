

function RTCHandlers(socket){

    const offerRequest = ({ offer, userId, type, iceCandidateArray, senderImageData })=>{
        socket.emit("offer", { offer, userId, type, iceCandidateArray, senderImageData })
    }   


    const offerResponses = (callback)=>{
        if(callback) 
            socket.on("offer", ({ offer, type , iceCandidateArray, senderImageData, userId})=>{
                callback({ offer, type, iceCandidateArray, senderImageData, userId })
            })
    }

    const answerRequest = ({ answer, userId })=>{
        socket.emit("answer", { answer, userId })
    }


    const answerResponses = (callback)=>{
        if(callback) socket.on("answer", ({ answer, userId , iceCandidateArray })=>{
            callback({answer, userId, iceCandidateArray})
        })
    }

    const abortPreConnection = ({userId})=>{
        if(userId) socket.emit("abortPreConnection", { userId })
    }

    const abortPreConnectionResponses = (callback)=>{
        if(callback) socket.on("abortPreConnection", ({userId})=> callback({userId}))
    }

    return {

        offerResponses,
        offerRequest,

        answerRequest,
        answerResponses,

        abortPreConnection,
        abortPreConnectionResponses,

    }
}

export default RTCHandlers