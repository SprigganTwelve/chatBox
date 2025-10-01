

import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useEffect, useRef, useContext, useState, useCallback } from 'react';

import { ChatBoxApiContext } from "/src/context/context";

import SVGanswer from '/src/assets/svg/phone-svgrepo-com.svg'
import SVGreject from '/src/assets/svg/phone-down-svgrepo-com.svg'
// import SVGsharescreen from '/src/assets/svg/screen-svgrepo-com.svg'

import { handlelocalAndRemoteTrack, handleReceiveAnswer, handleReceiveOffer,  handleSendingRTCOffer, handleShifttingAwaitingCallList, stopRTCSender } from './handlers';

import styles from './RTC.stream.call.module.css'



const StreamCall = ({
    defaultMode,
}) => {

    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const ringingAudioRef = useRef(null)
    const pickUpAudioRef = useRef(null)


    const [ mode ] = useState(defaultMode)              //switch from one mode to the other one (ex: audio -> audio & video)
    const [ isPickUp, setIsPickUp ] = useState(false)   // Help determine when the call is accepted or turnt down

    const { 
        socket,
        userData,
        currentChat,
        activeCall,
        PeerConnection,
        setActiveCall,
    } = useContext(ChatBoxApiContext)

    const mediaDevicesHandler = useCallback( async ({ rtcSession })=>{
            await handlelocalAndRemoteTrack({
                defaultMode,
                peer: rtcSession.peer,
                localVideo: localVideoRef.current,
                remoteVideo: remoteVideoRef.current,
            })
    },[])


    const initiateCallHandler = useCallback(async ({ rtcSession }) => {
        try{
            handleReceiveAnswer({ peer: rtcSession.peer, socketManager: socket.current })
            await handleSendingRTCOffer({
                userData,
                currentChat,
                activeCall,
                peer: rtcSession.peer,
                socketManager: socket.current,
            });
        }
        catch(err){
            console.log("Something went wrong while sending an offer", err)
            window.alert("Something went wrong")
        }
    }, [activeCall, currentChat, userData, socket]);



    const receiveCallhandler = useCallback((peer)=>{
        try{
            handleReceiveOffer({currentChat, activeCall, peer, socketManager: socket.current})
        }
        catch(error){
            console.log("Something went wrong while handling an the offer", error)
            window.alert("Something went wrong")
        }
    },[activeCall, currentChat, socket])



    
    useEffect(() => {

        const setup = async ()=>{
            const rtcSession = PeerConnection.current;

            if (!rtcSession) return;
            if (!socket.current) return; 

            ringingAudioRef.current.play();

            if (!rtcSession.peer || rtcSession.peer.signalingState === "closed") {
                rtcSession.peer = new RTCPeerConnection({
                    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
                });

                console.log("activeCall", activeCall)
                console.log("rtcSession", rtcSession)
                await mediaDevicesHandler({rtcSession})

                if (activeCall.initiate && socket.current)
                    initiateCallHandler({ rtcSession });
            }
        }

        setup()

    }, [initiateCallHandler]);




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
                        // hidden= { activeCall && !(activeCall.initiate?.type == "video" || activeCall.currentActiveCall?.type == "video") }
                    />
                    <video
                        ref={remoteVideoRef}
                        className={styles.remoteVideo}
                        // hidden= {  activeCall && !(activeCall.initiate?.type == "video" || activeCall.currentActiveCall?.type == "video")  } 
                    />
                </div>
                <audio
                    hidden
                    autoPlay
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
                                setIsPickUp(()=> true)
                                ringingAudioRef.current?.pause()
                                pickUpAudioRef.current?.play()

                                if (activeCall.currentActiveCall && socket.current && PeerConnection.current)
                                    receiveCallhandler(PeerConnection.current.peer)
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

                            socket.current.RTCHandlers.abortPreConnection({ 
                                userId: userData.id,
                                receiverId: currentChat?.receivers.split(" ")[0],
                            })
                            handleShifttingAwaitingCallList(PeerConnection.current, setActiveCall)
                            PeerConnection.current.peer = null
                            
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



StreamCall.propTypes = {
    peerAnswer: PropTypes.object ,
    defaultMode: PropTypes.string
}


export default StreamCall;

