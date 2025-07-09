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

export { handleShifttingAwaitingCallList, stopRTCSender }
