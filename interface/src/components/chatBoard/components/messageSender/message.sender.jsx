
import axios from 'axios';

import PropTypes from 'prop-types'
import { useContext, useState } from "react";
import { ChatBoxApiContext } from "../../../../context/context";
import { useCallback } from 'react';

import { insertFormattedDate } from "/src/utils/function";

import AudioRecognition from './components/audioRecognition/audio.recognition';
import AudioRecorder from './components/audioRecorder/audio.recorder';
import AboutOverlay from "/src/components/ui/aboutOverlay/about.overlay";
import FileExporter from '/src/components/ui/fileExporter/file.exporter';

import SVGfile from "/src/assets/svg/file.svg"

import styles from './message.sender.module.css'


const MessageSender = ({ talkSphereId, fullBackgroundOpacity, receivers, talkSphereFolder }) => {

    const [ value, setValue ] = useState("")
    const { socket, userId, setUsersTemporaryChat } = useContext(ChatBoxApiContext)

    const sendMessage = async ({ media, content, createdAt }) => {
        try{
            if(socket && setUsersTemporaryChat && receivers){

                const messageSent = { senderId: userId, talkSphereId, content, createdAt: createdAt ?? new Date(), media, talkSphereFolder }

                insertFormattedDate(messageSent);

                setUsersTemporaryChat((previous) => ({
                    id: talkSphereId,
                    messages: [...(previous.messages || []), messageSent ],
                }));

                socket.current.messagesSocketHandlers.sendMessageRequest({...messageSent, receivers: receivers.split(',')})

                setValue("")
            }
        }
        catch(error){
            console.log(error)
        }
    }

    const sendFile = useCallback( async (file, uploadedFilesArrayData)=>{
        try{
            const response = await fetch(
                                    `http://localhost:${import.meta.env.VITE_API_PORT}/talkSphere/messages/${talkSphereId}/${talkSphereFolder}/sendFiles`,{
                                    body: file.stream(),
                                    method: "POST",
                                    headers: {
                                        'X-user-id': userId,
                                        'X-filename': file.name,
                                        'X-File-Size': file.size,
                                        'X-File-Type' : file.type,
                                        'Content-Type': 'application/octet-stream',
                                        }
                                    })

            if (!response.ok) {
                throw new Error(`Erreur serveur: ${response.status}`);
            }

            let buffer = ''
            const reader = response.body.getReader()
            console.log("Send File response ",{response})
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                console.log('>>> CHUNK RECEIVED', value?.length);
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
                        if(Array.isArray(uploadedFilesArrayData)) uploadedFilesArrayData.push({ name: file.name, type: file.type })
                    } 
                    else if (line.startsWith('ERROR:')) {
                        console.error('Erreur:', line.replace('ERROR:', ''));
                    }
                }
            }
                        
        }
        catch(err){
            console.log("Something went wrong while downoading the file on the server, [filename] ", file.name, "[error]", err)
            throw(Error("Something went wrong while sending the file to the server"))
        }
    }, [talkSphereFolder, talkSphereId, userId])


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
                onKeyDown={async (event)=>{
                    if(event.key == "Enter"){
                        try{
                            const createdAt = Date.now()
                            await axios.post( `http://localhost:${import.meta.env.VITE_API_PORT}/talkSphere/messages/store`,{
                                content: value, userId, talkSphereId, createdAt
                            })
                            sendMessage({ media: null, content: value, createdAt })
                        }
                        catch(err){
                            console.log("Something went wrong when sending the message", err)
                        }
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
                            try{
                                blob.name = Date.now() + '.' + blob.type
                                const media = [ { name: blob.name ,  type: blob.type }  ]

                                await sendFile(blob)
                                await axios.post(
                                    `http://localhost:${import.meta.env.VITE_API_PORT}/talkSphere/messages/store/files`,{
                                     userId, talkSphereId, media
                                })
                                sendMessage( { media, content: null } )
       
                            }
                            catch(err){
                                console.log("Something went wrong while recording the audio into the server storage", err)
                            }
                        }}
                    />
                </AboutOverlay>
                <AboutOverlay text="File exporter">
                    <FileExporter 
                        callback = { async  (organizedFiles)=>{
                            try{
                                const uploadedFilesArrayData = []
                                for( const filesArray of Object.values(organizedFiles) ){
                                    for( const file of filesArray ){
                                        console.log("Sending file ...")
                                        await sendFile(file, uploadedFilesArrayData )
                                    }
                                }
                                await axios.post(
                                    `http://localhost:${import.meta.env.VITE_API_PORT}/talkSphere/messages/store/files`,{
                                     userId, talkSphereId, media: uploadedFilesArrayData
                                })
                                sendFile({ media: uploadedFilesArrayData, content: null })
                            }
                            catch(err){
                                console.log("Something went wrong while recording all the files into the server storage", err)
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