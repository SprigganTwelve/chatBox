
import axios from 'axios';

import clsx from "clsx"
import PropTypes from 'prop-types'
import { useContext, useState, useCallback, useEffect, useRef } from "react";

import { ChatBoxApiContext } from "../../../../context/context";

import { insertFormattedDate } from "/src/utils/time.utils";

import AudioRecorder from './components/audioRecorder/audio.recorder';
import AboutOverlay from "/src/components/ui/aboutOverlay/about.overlay";
import FileExporter from '/src/components/ui/fileExporter/file.exporter';
import AudioRecognition from './components/audioRecognition/audio.recognition';

import SVGfile from "/src/assets/svg/file.svg"
import SVGsend from '/src/assets/svg/send-email-svgrepo-com.svg'
import SVGsendingOption from '/src/assets/svg/options-svgrepo-com.svg'

import styles from './message.sender.module.css'




export const MESSAGE_SENDER_HEIGHT = 69


const MessageSender = ({ talkSphereId, fullBackgroundOpacity, receivers, talkSphereFolder }) => {

    const mediaRecorderRef = useRef(null)                                                           // use to record the user voice if needed 
    const [ value, setValue ] = useState("")                                                        // the input/text value
    const { socket, userId, setUsersTemporaryChat, baseApiURL } = useContext(ChatBoxApiContext)
    const [ optionBoxConfig, setOptionBoxConfig ] = useState({ open: false, overlayTrigger: "" })   //for responsive design


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
                                    `${baseApiURL.current}/talkSphere/messages/${talkSphereId}/${talkSphereFolder}/sendFiles`,{
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

                        await new Promise(res => setTimeout(res, 300))

                        await axios.post(
                                    `${baseApiURL.current}/talkSphere/messages/store/files`,{
                                     userId, talkSphereId, fileName, fileType: file.type, talkSphereFolder
                        })
    
                        await sendMessage({ content: null, media: [ { name: fileName ,  type: file.type } ] });

                        if(Array.isArray(sucess))
                            sucess.push({ fileName , fileType: file.type })
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



    const fowardMessage = useCallback(async()=>{
            try{
                const createdAt = Date.now()
                if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                    mediaRecorderRef.current.stop();
                }

                if(value){
                    await axios.post( `${baseApiURL.current}/talkSphere/messages/store`,{
                            content: value, userId, talkSphereId, createdAt
                    })
                    sendMessage({ media: null, content: value, createdAt })
                }
            }
            catch(err){
                console.log("Something went wrong when sending the message", err)
            }
    },[sendMessage, value])

    // useEffect(()=> console.log(openOptionBox), [openOptionBox])

    return ( 
        <div
            className={styles.container}
            style={{
                "--opacityBackground" : fullBackgroundOpacity,
                "--message-sender-height": MESSAGE_SENDER_HEIGHT + "px"
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
                        fowardMessage()
                    }
                }}
            />
            <div className={ styles.recorders } >
                    <div 
                        className={clsx( styles.optionsPart, optionBoxConfig.open ? styles.showBox : "") }
                    >
                            <div className={styles.iconSet}>
                                <AboutOverlay
                                    text="Audio recognition"
                                >
                                    <AudioRecognition />
                                </AboutOverlay>
                            </div>
                            <div 
                                className={styles.iconSet}
                                onClick={ ()=> setOptionBoxConfig( prev => ({ ...prev, overlayTrigger: "audio" }) ) }
                            >
                                <div className={ optionBoxConfig.overlayTrigger === "audio" ? styles.overlayTrigger : "" }>           
                                    <AboutOverlay
                                        text="Audio recorder"
                                    >
                                        <AudioRecorder
                                            mediaRecorderRef = {mediaRecorderRef}
                                            onDataAvailableHandler = { async (blob)=>{
                                                if(!talkSphereFolder){
                                                    return
                                                }
                                                console.log("AUDIO BLOB", blob)
                                                await sendFile(blob);
                                            }}
                                        />
                                    </AboutOverlay>
                                </div>
                            </div>
                            <div className={styles.iconSet}>
                                <AboutOverlay text="File exporter">
                                    <FileExporter 
                                        callback = { async  (organizedFiles)=>{
                                            if(!talkSphereFolder){
                                                return
                                            }
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
                
                    <div className={styles.iconSet}>
                        <img 
                            alt="send"
                            src={SVGsend}
                            className={styles.icon}
                            onClick={()=> fowardMessage()}
                        />
                    </div>
                    <div className={styles.iconSet}>
                        <img 
                            alt="options"
                            src={SVGsendingOption}
                            onClick={()=> setOptionBoxConfig((prev) => ({ open: !prev.open }))}
                            className={clsx(styles.icon, styles.sendingOptions)}
                        />
                    </div>
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