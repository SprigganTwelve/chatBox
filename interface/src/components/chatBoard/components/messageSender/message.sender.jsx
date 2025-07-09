
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

    const sendMessage = useCallback(async ({ media, content, createdAt }) => {
        try{
            if( socket && setUsersTemporaryChat && receivers ){

                console.log("sending messages or note through socket...")
                const messageSent = { senderId: userId, content, talkSphereId, createdAt: createdAt ?? new Date(), media, talkSphereFolder }

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
    },[receivers, setUsersTemporaryChat, socket, talkSphereFolder, talkSphereId, userId])


    const sendFile = useCallback( async ( file, sucess, failed )=>{
        try{
            let fileName = Date.now() + "_" + file.name

            fileName = fileName
                    .replace(/\s+/g, '_')
                    .replace(/[^\w.-]/g, '');

            const response = await fetch(
                                    `http://localhost:${import.meta.env.VITE_API_PORT}/talkSphere/messages/${talkSphereId}/${talkSphereFolder}/sendFiles`,{
                                    body: file,
                                    method: "POST",
                                    headers: {
                                        'X-user-id': userId,
                                        'X-filename': fileName,
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
                        console.log('Uploading ended.');

                        await axios.post(
                                    `http://localhost:${import.meta.env.VITE_API_PORT}/talkSphere/messages/store/files`,{
                                     userId, talkSphereId, fileName, fileType: file.type
                        })
    
                        await sendMessage({ content: null, media: [ { name: fileName ,  type: file.type } ] });

                        if(Array.isArray(sucess))
                            sucess.push({fileName , fileType: file.type })
                    } 
                    else if (line.startsWith('ERROR:')) {
                        console.error('Error:', line.replace('ERROR:', ''));
                        if(Array.isArray(failed))
                            failed.push(file);
                    }
                }
            }
                        
        }
        catch(err){
            throw new Error(`Upload failed for file ${file.name}: ${err.message}`);
        }
    }, [sendMessage, talkSphereFolder, talkSphereId, userId])


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
                                blob.name = Date.now() + '.' + blob.type.split('/')[1]
                                console.log("name ", blob.name, 'type' , blob.type)
                                await sendFile(blob)
                            }
                            catch(err){
                                console.log("Something went wrong while makin the request ", err)
                            }
                        }}
                    />
                </AboutOverlay>
                <AboutOverlay text="File exporter">
                    <FileExporter 
                        callback = { async  (organizedFiles)=>{
                            const uploadedFilesArray = []
                            const failedUploadingFilesArray = []
                            for( const filesArray of Object.values(organizedFiles) ){
                                for( const file of filesArray ){
                                    console.log("Sending file ...")
                                    await sendFile( file, uploadedFilesArray, failedUploadingFilesArray ).catch((err)=>{
                                        console.log("Something went wrong while recording all the files into the server storage", err)
                                    })
                                }
                            }
                            console.log("uploading uploaded files", { uploadedFilesArray })
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
    receivers: PropTypes.string,
    talkSphereId: PropTypes.number,
    currentChatId: PropTypes.number,
    talkSphereFolder: PropTypes.string,
    fullBackgroundOpacity: PropTypes.number,
}
 
export default MessageSender;