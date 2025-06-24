

import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useEffect, useRef, useContext, useState, useCallback } from 'react';

import { ChatBoxApiContext } from "/src/context/context";

import SVGanswer from '/src/assets/svg/phone-svgrepo-com.svg'
import SVGreject from '/src/assets/svg/phone-down-svgrepo-com.svg'
// import SVGsharescreen from '/src/assets/svg/screen-svgrepo-com.svg'

import styles from './stream.call.module.css'



const StreamCall = ({
    defaultMode,
}) => {

    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const ringingAudioRef = useRef(null)
    const pickUpAudioRef = useRef(null)


    const [ mode ] = useState(defaultMode)              //switch from one mode to the other one (ex: audio -> video)
    const [ isPickUp, setIsPickUp ] = useState(false)  // Help determine when the call is accepted or turnt down

    const { 
        socket,
        userData,
        currentChat,
        activeCall,
        PeerConnection,
        setActiveCall,
    } = useContext(ChatBoxApiContext)


    //--- Handler to or stop track

    const stopRTCSender = useCallback((peer, kind)=>{
        const senders = peer.getSenders()
        senders.forEach((sender)=> {
            if(kind && typeof kind == "string" ){
                if(sender.track.kind === kind.trim())
                    sender.track.stop()
                return
            }
            sender.track.stop()
        })
    },[])


    //--- Handler to mange outgoing call 

    const handleSendingRTCOffer = useCallback(async ({peer, socketManager})=>{
        const iceCandidateArray = []
        const offer  = await peer.createOffer()
        await peer.setLocalDescription(offer)

        peer.onicegatheringstatechange = (()=>{
            if(peer.iceGatheringState === "complete"){
                socketManager.RTCHandlers.offerRequest({
                    offer,
                    iceCandidateArray,
                    userId: currentChat.receivers.split(' ')[0],
                    senderImageData: {
                        image: userData.image,
                        folder: userData.folder,
                    },
                    type: activeCall.initiate.type,
                })
            }
        })

        peer.onicecandidate = ((event)=>{
            if(event.candidate){
                iceCandidateArray.push(event.candidate)
            }
        })

    },[activeCall, currentChat, userData])


    //---Handler to manage incoming call offer 

    const handleReceiveOffer = useCallback(async ({ peer, socketManager })=>{
        if( peer && activeCall.currentActiveCall ){

            const iceCandidateArray = []
            
            await peer.setRemoteDescription(new RTCSessionDescription(activeCall.currentActiveCall.offer))

            for ( const candidate of activeCall.currentActiveCall.iceCandidatesArray ){
                await peer.addIceCandidate(candidate)
            }

            const answer = await peer.createAnswer()
            await peer.setLocalDescription(answer)

            peer.onicecandidate = (event)=>{
                if(event.candidate){
                    iceCandidateArray.push(event.candidate)
                }
            }

            peer.onicegatheringstatechange = ()=>{
                if(peer.iceGatheringState === "complete"){
                    socketManager.RTCHandlers.answerRequest({ 
                        answer, 
                        iceCandidateArray,
                        userId: currentChat.receivers.split(" ")[0],
                    })
                }
            }

            if(activeCall.currentActiveCall.type && activeCall.currentActiveCall.type.trim() === "call-only"){
                stopRTCSender(peer, 'video')
            }


            ringingAudioRef.current.pause()
            pickUpAudioRef.current.play()

            setIsPickUp( ()=> true )

        }

    },[activeCall.currentActiveCall, currentChat.receivers, stopRTCSender])


    //--Handle answer 

    const handleReceiveAnswer = useCallback(({ peer, socketManager })=>{
        socketManager.RTCHandlers.answerResponses( async ({ answer, iceCandidateArray })=>{
            if(answer && iceCandidateArray){

               //---store answer/icecandidates

               await  peer.setRemoteDescription(new RTCSessionDescription(answer))
               
               for ( const candidate of activeCall.currentActiveCall.iceCandidatesArray ){
                  await peer.addIceCandidate(candidate)
               }

               //-----stop-ringing
               ringingAudioRef.current.pause()
               pickUpAudioRef.current.play()
               setIsPickUp( ()=> true )
            }
        })
    }, [activeCall.currentActiveCall])
    

    //---Main handler to deal with incoming and outgoing call

    const handleStramCall = useCallback(async ()=>{
        try{

            console.log(activeCall)
            const socketManager = socket.current
            const localVideo = localVideoRef.current
            const remoteVideo = remoteVideoRef.current
            const rtcSession  = PeerConnection.current
            const ringing = ringingAudioRef.current

            
            //-----ringing

            if(ringing){
                ringing.volume = 1
                ringing.muted = false
                await ringing.play()
            }

            await navigator.mediaDevices.getUserMedia({  audio: true }).then((stream)=>{
                stream.getTracks().forEach((track)=>{
                    rtcSession.peer.addTrack(track, stream)
                })
            })

            if(defaultMode === "video"){
                await navigator.mediaDevices.getUserMedia({  video: true }).then((stream)=>{
                    if(localVideo){
                        const videoTrack = stream.getVideoTracks()[0]
                        rtcSession.peer.addTrack(videoTrack, stream)
                        localVideo.srcObject = stream
                        localVideo.play()
                    }
                })
            }

            if(rtcSession && activeCall && remoteVideo){
                
                //---- peer and connection state

                const remoteCombinedStream =  new MediaStream()

                rtcSession.peer.ontrack = (event)=>{
                    remoteCombinedStream.addTrack(event.track)
                    if( remoteVideo && remoteVideo.srcObject != remoteCombinedStream ){               
                        remoteVideo.srcObject = remoteCombinedStream
                        remoteVideo.play().catch((err) => console.log(" Error whole reading video ", err))
                    }
                }

                rtcSession.peer.onconnectionstatechange = ()=>{

                    if( rtcSession.peer.connectionState === "closed" ){

                        const updatedActiveCall = {
                                initiate: null, 
                                currentActiveCall: null
                            }

                        if(Array.isArray(rtcSession.callOfferArray) && rtcSession.callOfferArray.length > 0){
                            updatedActiveCall.currentActiveCall = rtcSession.callOfferArray[0]; 
                            rtcSession.callOfferArray.splice( 0, 1 )
                            setActiveCall( ()=> updatedActiveCall )
                            return
                        }

                        stopRTCSender(rtcSession.peer)
                        rtcSession.peer.isAvailable = true;
                    }
                    else if( rtcSession.peer.connectionState === "failed" ){
                        stopRTCSender(rtcSession.peer)
                        alert('Connection between users failed')
                        setActiveCall( ()=> ({ initiate: null, currentActiveCall: null }) )
                    }
                    else if (rtcSession.peer.connectionState === "connected") {
                        console.log("Connexion WebRTC établie !");
                    }

                }

                //---- picking up....

                if(activeCall.initiate){
                    handleReceiveAnswer({
                        socketManager,
                        peer: rtcSession.peer,
                    })
                    handleSendingRTCOffer({
                        socketManager,
                        peer: rtcSession.peer,
                    })
                }
            }

        }
        catch(err){
            console.log("Something went wrong", err)
        }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        socket,
        activeCall,
        currentChat,
        PeerConnection, 
        handleReceiveOffer,
        handleSendingRTCOffer,
    ])





    useEffect(()=>{
        const rtcSession = PeerConnection.current
        if(rtcSession && (!rtcSession.peer || rtcSession.peer.signalingState === "closed")){
            rtcSession.peer = new RTCPeerConnection({
                iceServers: [
                    { urls:  'stun:stun.l.google.com:19302' }
                ]
            })
        }
        handleStramCall()

    },[PeerConnection, defaultMode, handleStramCall, socket])




    if(!userData){
        return;
    }

    return ( 
        <div className={styles.main}>

            {
                mode == "call-only" && (
                    <div>
                        <img
                            alt="Image"
                            className={styles.profileImage}
                            src={
                                activeCall &&  activeCall.initiate ?
                                    `http://localhost:${import.meta.env.VITE_API_PORT}/uploads/users/${currentChat.image_data.folder}/parameters/${currentChat.image_data.image}`
                                    : activeCall.currentActiveCall  && activeCall.currentActiveCall.senderImageData.image ?
                                        `http://localhost:${import.meta.env.VITE_API_PORT}/uploads/users/${activeCall.currentActiveCall.senderImageData.folder}/parameters/${activeCall.currentActiveCall.senderImageData.image}`
                                        : "#"
                            }
                        />
                    </div>
                )
            }
            <div>    
                <div className={styles.videoSection}>
                    <video 
                        muted
                        autoPlay
                        playsInline
                        ref={localVideoRef}
                        className={styles.localVideo}
                        hidden= { activeCall && activeCall.initiate 
                                  && activeCall.initiate.type !== "video"
                        }
                    />
                    <video
                        ref={remoteVideoRef}
                        className={styles.remoteVideo}
                        hidden= { activeCall && activeCall.initiate 
                                  && activeCall.initiate.type !== "video"
                        } 
                    />
                </div>
                <audio 
                    hidden
                    ref={ringingAudioRef}
                    src="/src/assets/audio/pelupelupelu_song.mp3"
                />
                <audio 
                    hidden
                    ref={pickUpAudioRef}
                    src="/src/assets/audio/catcha.mp3"
                />
            </div>
            
            <div className={styles.iconSection}>    
                {
                    !isPickUp && activeCall && !activeCall.initiate && 
                    (
                        <div 
                            className={ clsx(styles.iconContainer, styles.green) }
                            onClick={()=>{
                                ringingAudioRef.current?.pause()
                                pickUpAudioRef.current?.play()
                                setIsPickUp(()=> true)

                                if (activeCall.currentActiveCall && socket.current && PeerConnection.current){
                                    handleReceiveOffer({
                                        socketManager: socket.current,
                                        peer: PeerConnection.current.peer,
                                    })
                                }
                            }}
                        >
                            <img 
                                alt="" 
                                src={ SVGanswer } 
                                className={styles.icon}
                            />
                        </div>
                    )
                }
                <div 
                    className={ clsx(styles.iconContainer, styles.red) }
                    onClick={()=>{
                            
                            ringingAudioRef.current?.pause()

                            setIsPickUp( ()=> false )
                            const peer = PeerConnection.current?.peer

                            if(peer)  {//stop the session
                                peer.close()
                                stopRTCSender(peer)
                                if(currentChat && peer.connectionState !== "connected"){
                                    socket.current.RTCHandlers.abortPreConnection({ 
                                        userId: currentChat.receivers.split(' ')[0]
                                    })
                                }
                            }

                            setActiveCall(()=> ({ 
                                initiate: null, 
                                currentActiveCall: null
                            }))
                    }}
                >
                    <img 
                        alt=""
                        src={ SVGreject } 
                        className={styles.icon}
                    />
                </div>
            </div>

        </div>
     );
}

 
export default StreamCall;


StreamCall.propTypes = {
    peerAnswer: PropTypes.object ,
    defaultMode: PropTypes.string
}

