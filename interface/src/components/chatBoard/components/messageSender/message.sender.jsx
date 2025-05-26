
import axios from 'axios'

import PropTypes from 'prop-types'
import { useContext, useState } from "react";
import { ChatBoxApiContext } from "../../../../context/context";

import AudioRecognition from './components/audioRecognition/audio.recognition';
import AudioRecorder from './components/audioRecorder/audio.recorder';
import AboutOverlay from "/src/components/ui/aboutOverlay/about.overlay";
import FileExporter from '/src/components/ui/fileExporter/file.exporter';

import SVGfile from "/src/assets/svg/file.svg"

import styles from './message.sender.module.css'


const MessageSender = ({ talkSphereId, fullBackgroundOpacity, receivers, talkSphereFolder }) => {

    const [ value, setValue ] = useState("")
    const { socket, userId } = useContext(ChatBoxApiContext)

    const sendMessage = async ({ media }) => {
        try{
            if(socket && receivers){
                const createdAt = new Date();
                const messageSent = { senderId: userId, talkSphereId, content: value, createdAt, media, talkSphereFolder }
                socket.current.messagesSocketHandlers.sendMessageRequest({...messageSent, receivers: receivers.split(',')})
                setValue("")
            }
        }
        catch(error){
            console.log(error)
        }
    }



    return ( 
        <div
            className={styles.container}
            style={{
                "--opacityBackground" : fullBackgroundOpacity
            }}
        >
            <div className={styles.inputbefore} />
            <input
                type="text"
                value={value}
                className={styles.input}
                placeholder='Entrez votre message ici'
                onChange={(event)=> setValue(event.target.value)}
                onKeyDown={(event)=>{
                    if(event.key == "Enter"){
                        sendMessage({ media: null})
                    }
                }}
            />
            <div className={styles.recorders}>
                <AboutOverlay
                    text="Audio recognition"
                >
                    <AudioRecognition />
                </AboutOverlay>
                <AboutOverlay
                    text="Audio recorder"
                >
                    <AudioRecorder
                        onSend={ async (blob)=>{
                            sendMessage( { media: [ { audio: {blob ,  type: "webm"} } ]} )
                        }}
                    />
                </AboutOverlay>
                <AboutOverlay text="File exporter">
                    <FileExporter 
                        callback = { (organizedFiles)=>{
                            axios.post(`http://localhost:${import.meta.env.VITE_API_PORT}/talkSphere/:${talkSphereId}/sendFiles`, { organizedFiles, talkSphereFolder, receivers: receivers.split(',') })
                        } }
                    >
                        <img 
                            src={SVGfile}
                            alt="Import file"
                            className={styles.icon}
                        />
                    </FileExporter>
                </AboutOverlay>
            </div>
        </div>
     );
}

MessageSender.propTypes = {
    receivers: PropTypes.array,
    talkSphereId: PropTypes.number,
    currentChatId: PropTypes.number,
    talkSphereFolder: PropTypes.string,
    fullBackgroundOpacity: PropTypes.number,
}
 
export default MessageSender;