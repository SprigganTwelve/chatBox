

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
                        callback = { async  (organizedFiles)=>{
                            for( const filesArray of Object.values(organizedFiles) ){
                                for( const file of filesArray ){
                                    const response = await fetch(
                                        `http://localhost:${import.meta.env.VITE_API_PORT}/talkSphere/:${talkSphereId}/${talkSphereFolder}/sendFiles`,{
                                        Body: file.stream(),
                                        method: "POST",
                                        headers: {
                                            'X-filename': file.name,
                                            'X-File-Size': file.size,
                                            'Content-Type': 'application/octet-stream',
                                            'X-File-Type' : file.type
                                        }
                                    })

                                    let buffer = ''
                                    const reader = response.body.getReader()
                                    const decoder = new TextDecoder();

                                    while (true) {
                                        const { done, value } = await reader.read();
                                        if (done) break;

                                        buffer += decoder.decode(value, { stream: true });

                                        let lines = buffer.split('\n');
                                        buffer = lines.pop(); 

                                        for (const line of lines) {
                                            if (line.startsWith('PROGRESS:')) {
                                                const trandferRation = line.replace('PROGRESS:', '');
                                                console.log(`Progression: ${trandferRation}`);
                                            } 
                                            else if (line.startsWith('DONE')) {
                                                console.log('Téléversement terminé.');
                                            } 
                                            else if (line.startsWith('ERROR:')) {
                                                console.error('Erreur:', line.replace('ERROR:', ''));
                                            }
                                        }
                                    }

                                }
                            }
                        }}
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