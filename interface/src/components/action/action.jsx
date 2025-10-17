
import { useCallback, useContext, useState } from "react";


import { ChatBoxApiContext } from "/src/context/context";

import { checkAvailableMediaDevices } from "/src/utils/media.flux";

import Modal from "/src/components/ui/modal/modal";
import ViewOption from "/src/components/ui/viewOption/view.option";
import AboutOverlay from "/src/components/ui/aboutOverlay/about.overlay";


import SVGbox from "/src/assets/svg/box-svgrepo-com.svg"
import SVGblock from "/src/assets/svg/block-svgrepo-com.svg"
import SVGadd from '/src/assets/svg/add-circle-svgrepo-com.svg'
import SVGread from "/src/assets/svg/read-only-svgrepo-com.svg"
import SVGvideo from "/src/assets/svg/video-call-svgrepo-com.svg"
import SVGcall from "/src/assets/svg/call-receive-svgrepo-com.svg"
import SVGdelete from "/src/assets/svg/delete-email-svgrepo-com.svg"
import SVGoptions from "/src/assets/svg/options-vertical-svgrepo-com.svg"
import SVGclose from '/src/assets/svg/close-circle-svgrepo-com.svg'

import styles from "./action.module.css"



const Action = () => {

    const [ showActionOptions, setShowActionOptions ]   = useState(false)   
    const { talkSphereId, setActiveCall, PeerConnection } = useContext(ChatBoxApiContext)
    
    const handleActivateAudioCall = useCallback(()=>{
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
                            }, [setActiveCall])

    const handleActivateVideoCall = useCallback(()=>{ 
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

                            }, [setActiveCall])

    return ( 
        <>
            {
                talkSphereId && (
                    <>
                        <div className={styles.container}>
                            <img 
                                src={SVGcall}
                                className={styles.callIcon}
                                onClick={ handleActivateAudioCall }
                            />
                            <img 
                                src={SVGvideo}
                                className={styles.callIcon}
                                onClick={ handleActivateVideoCall }
                            />
                            <AboutOverlay text = "Options">
                                <img
                                    src={SVGoptions}
                                    className={styles.more}
                                    onClick={()=> setShowActionOptions((prev)=> !prev)} 
                                />
                            </AboutOverlay>
                        </div>
                
                        <Modal 
                            open={showActionOptions}
                            onClose = { ()=>  setShowActionOptions(false) }
                        >
                            <div className={styles.actionOptionsConatiner}>
                                <img 
                                    alt="Close"
                                    src={SVGclose}
                                    onClick={()=> setShowActionOptions(false)}
                                    className={styles.closeIcon}
                                />
                                <div className={styles.desc}>
                                    <img className={styles.svgBox} src={SVGbox} alt="chatBox" />
                                    <p>
                                        ChatBox t’offre un espace d’échange simple et apaisant.
                                        Parle, ris, partage — sans bruit, sans stress, juste toi et ta voix.
                                        Chaque appel devient une bulle de connexion sincère
                                    </p>
                                </div>
                                <div className={styles.options}>
                                    <div>
                                        <ViewOption 
                                                pulse = "25px"
                                                leading={SVGblock}
                                                padding = "10px 20px"
                                                onClick = { ()=>{} }
                                                title="Blacklist this user"
                                        />
                                    </div>
                                    <div>
                                        <ViewOption 
                                                pulse = "25px"
                                                leading={SVGadd}
                                                padding = "10px 20px"
                                                onClick = { ()=>{}  }
                                                title="Change this screen background"
                                        />
                                    </div>

                                    <div>
                                        <ViewOption 
                                                pulse = "25px"
                                                leading={SVGread}
                                                padding = "10px 20px"
                                                title="Allow messages marked as read"
                                                onClick = { ()=>{}  }
                                        />
                                    </div>
                                    <div>
                                        <ViewOption 
                                                pulse = "25px"
                                                leading={SVGdelete}
                                                padding = "10px 20px"
                                                title="Auto delete message"
                                                onClick = { ()=>{}  }
                                        />
                                    </div>
                                    <div>
                                        <ViewOption 
                                                pulse = "25px"
                                                leading={SVGcall}
                                                title="Make a call"
                                                padding = "10px 20px"
                                                onClick = { handleActivateAudioCall  }
                                        />
                                    </div>
                                    <div>
                                        <ViewOption 
                                                pulse = "25px"
                                                leading={SVGvideo}
                                                padding = "10px 20px"
                                                title="Make a video call"
                                                onClick = { handleActivateVideoCall }
                                        />
                                    </div>
                                </div>
                            </div>
                        </Modal>    
                    </>
                )
            }
        </>
     );
}
 
export default Action;