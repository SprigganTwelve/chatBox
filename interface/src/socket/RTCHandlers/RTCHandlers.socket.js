

function RTCHandlers(socket){

    const offerRequest = ({ offer, userId, type, iceCandidateArray, senderImageData, receiverId })=>{
        if(offer && userId && type && iceCandidateArray && senderImageData && receiverId)
            socket.emit("offer", { offer, userId, type, iceCandidateArray, senderImageData, receiverId })
    }   


    const offerResponses = (callback)=>{
        if(callback) 
            socket.on("offer", ({ offer, type , iceCandidateArray, senderImageData, userId})=>{
                callback({ offer, type, iceCandidateArray, senderImageData, userId })
            })
    }

    const offOfferResponses = ()=> socket.off("offer")

    const answerRequest = ({ answer, userId })=>{
        socket.emit("answer", { answer, userId })
    }


    const answerResponses = (callback)=>{
        if(callback) socket.on("answer", ({ answer, userId , iceCandidateArray })=>{
            callback({answer, userId, iceCandidateArray})
        })
    }

    const offAnswerResponses = ()=> socket.off("answer")



    const abortPreConnection = ({userId, receiverId})=>{
        if(userId &&  receiverId) socket.emit("abortPreConnection", { userId, receiverId })
    }


    const abortPreConnectionResponses = (callback)=>{
        if(callback) socket.on("abortPreConnection", ({ userId })=> callback({userId}))
    }


    const offAbortPreConnectionResponses = ()=> socket.off("abortPreConnection")

    return {

        offerResponses,
        offerRequest,
        offOfferResponses,

        answerRequest,
        answerResponses,
        offAnswerResponses,

        abortPreConnection,
        abortPreConnectionResponses,
        offAbortPreConnectionResponses,
    }
}

export default RTCHandlers