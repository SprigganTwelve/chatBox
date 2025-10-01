

// ---- requesting for media devices from navigator

const handleRequestingMediaDevices = async ({
    defaultMode
})=>{
        let localStream;

        if(defaultMode === "call-only")
            localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        else
            localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })

        return localStream;
}


// Here we link the peer connection along with the user's tracks


const handlelocalAndRemoteTrack = async ({ defaultMode, peer, localVideo, remoteVideo })=>{
            if(!remoteVideo && !localVideo)
                return;

            const localStream = await handleRequestingMediaDevices({ defaultMode })
            peer.ontrack = (event)=>{
                console.log("ontrack event", event)
                if(event.streams[0]){                               //unavailable on some navigators
                    const  [remoteStream] = event.streams
                    remoteVideo.srcObject = remoteStream;
                }
                else{
                    const remoteStream = new MediaStream();  
                    remoteStream.addTrack(event.track)
                    remoteVideo.srcObject = remoteStream
                }
            }
            localStream.getTracks().forEach(track => peer.addTrack(track, localStream))
            localVideo.srcObject = localStream
            console.log({ defaultMode, peer, localVideo, remoteVideo })
}


//--- Handler to mange outgoing call 

const handleSendingRTCOffer = async ({ userData, currentChat, activeCall, peer, socketManager })=>{
    const iceCandidateArray = []
    const offer  = await peer.createOffer()

    socketManager.emit('test')
    socketManager.on('test', (msg)=> console.log(msg))

    peer.onicecandidate = ((event)=>{
        if(event.candidate){
            iceCandidateArray.push(event.candidate)
        }
        else{
            socketManager.RTCHandlers.offerRequest({
                offer,
                iceCandidateArray,
                userId: userData.id,
                receiverId: currentChat?.receivers.split(" ")[0],
                senderImageData: {
                    image: userData.image,
                    folder: userData.folder,
                },
                type: activeCall.initiate.type,
            })
        }
    })

    console.log({ userData, currentChat, activeCall, peer, socketManager, offer, iceCandidateArray })

    await peer.setLocalDescription(offer)
}



//---Handler to manage incoming call offer 

const handleReceiveOffer = async ({ currentChat, activeCall, peer, socketManager })=>{
    if( peer && activeCall.currentActiveCall ){

        const iceCandidateArray = []
        await peer.setRemoteDescription(new RTCSessionDescription(activeCall.currentActiveCall.offer))
        const answer = await peer.createAnswer()

        peer.onicecandidate = (event)=>{
            if(event.candidate){
                iceCandidateArray.push(event.candidate)
            }else{
                socketManager.RTCHandlers.answerRequest({ 
                    answer, 
                    iceCandidateArray,
                    userId: currentChat.receivers.split(" ")[0],
                })
            }
        }


        for ( const candidate of activeCall.currentActiveCall.iceCandidateArray ){
            await peer.addIceCandidate(candidate)
        }

        await peer.setLocalDescription(answer)

        return answer;
    }

}



//--Handler to permit an answer to be use or taken as valid 

const handleReceiveAnswer = ({ peer, socketManager }) => {

    if (!peer || !socketManager) return;

        socketManager.RTCHandlers.offAnswerResponses()

        socketManager.RTCHandlers.answerResponses( async ({ answer, iceCandidateArray })=>{
            if(answer && iceCandidateArray){
               //---store answer/icecandidates

               await  peer.setRemoteDescription(new RTCSessionDescription(answer))
               console.log("handleReacived answer", iceCandidateArray)
               for ( const candidate of iceCandidateArray ){
                  await peer.addIceCandidate(candidate)
               }
            }
        })

}



//--- Handler to or stop track

const stopRTCSender = (peer, kind)=>{
    if(peer){
        const senders = peer.getSenders()
        senders.forEach((sender)=> {
            if( kind && typeof kind == "string" ){
                if(sender.track.kind === kind.trim())
                    sender.track.stop()
                return
            }
            sender.track.stop()
        })
        return
    }
    console.log("Please, make to check if the peer connection exist ans is correctly pass to close the tracks")
}




//--- handle awaiting list call 
        
const handleShifttingAwaitingCallList = (rtcSession, setActiveCall)=>{
        
    if(!rtcSession && !setActiveCall) return

    if(rtcSession.peer){
        rtcSession.peer.close()
        stopRTCSender(rtcSession.peer)
    }

    if(Array.isArray(rtcSession.callOfferArray) && rtcSession.callOfferArray.length > 0){
        setActiveCall( ()=> ({
            initiate: null,
            currentActiveCall: rtcSession.callOfferArray.shift()
        }) )
        return
    }
    rtcSession.isAvailable = true;
    setActiveCall(()=> ({ initiate: null, currentActiveCall: null }))
}




export { 
    handleRequestingMediaDevices, handlelocalAndRemoteTrack, handleSendingRTCOffer, 
    handleReceiveOffer, handleReceiveAnswer  , stopRTCSender, handleShifttingAwaitingCallList
}
