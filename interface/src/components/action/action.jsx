
import { useContext, useRef } from "react";


import { ChatBoxApiContext } from "/src/context/context";

import AboutOverlay from "/src/components/ui/aboutOverlay/about.overlay";

import { checkAvailableMediaDevices } from "/src/utils/media.flux";

import SVGcall from "/src/assets/svg/call-receive-svgrepo-com.svg"
import SVGvideo from "/src/assets/svg/video-call-svgrepo-com.svg"
import SVGoptions from "/src/assets/svg/options-vertical-svgrepo-com.svg"


import styles from "./action.module.css"



const Action = () => {

    const audioRef = useRef(null)
    const { talkSphereId, setActiveCall, PeerConnection } = useContext(ChatBoxApiContext)

    return ( 
        <>
            {
                talkSphereId && (
                    <div className={styles.container}>
                        <img 
                            src={SVGcall}
                            className={styles.icon}
                            onClick={()=>{
                                checkAvailableMediaDevices().then(({hasAudioInput}) => {
                                    if(hasAudioInput){
                                        PeerConnection.current.isAvailable = false
                                        setActiveCall(
                                            (previous)=> ({ ...previous, initiate: { type: "call-only" } }) 
                                        )
                                    }
                                    else{
                                        alert("You don't have any usable or available audio peripherics")
                                    }
                                })
                            }}
                        />
                        <img 
                            src={SVGvideo}
                            className={styles.icon}
                            onClick={()=>{ 
                                checkAvailableMediaDevices().then(({ hasVideoInput, hasAudioInput })=>{
                                    if(hasAudioInput){
                                        if(hasVideoInput){
                                            PeerConnection.current.isAvailable = false
                                            setActiveCall((previous)=> 
                                                ({ ...previous, initiate: { type: "video" } }) 
                                            )
                                        }
                                        else{
                                            alert("You must activate your webcam")
                                        }
                                    }
                                    else{
                                        alert("You don't have any usable or available audio peripherics")
                                    }
                                })

                            }}
                        />
                        <AboutOverlay text = "Options">
                            <img src={SVGoptions} className={styles.icon} />
                        </AboutOverlay>
                        
                        <audio 
                            hidden
                            ref={audioRef}
                        />

                    </div>
                )
            }
        </>
     );
}
 
export default Action;