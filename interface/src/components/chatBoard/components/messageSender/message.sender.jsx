
import PropTypes from 'prop-types'
import { useContext, useState } from "react";
import styles from './message.sender.module.css'
import { insertFormattedDate } from "/src/utils/function"
import { ChatBoxApiContext } from "../../../../context/context";
import AudioRecognition from './components/audioRecognition/audio.recognition';
import AudioRecorder from './components/audioRecorder/audio.recorder';


const MessageSender = ({ talkSphereId,  currentChatId, fullBackgroundOpacity }) => {

    const [value, setValue] = useState("")
    const { socket, userId, setUsersTemporaryChat } = useContext(ChatBoxApiContext)

    const sendMessage = async () => {
        try{
            if(socket){
                const createdAt = new Date();
                console.log(talkSphereId)
                socket.current.emit("privateMessage",{ senderId: userId, receiverId: currentChatId , talkSphereId, content: value, createdAt })
                const dataSent = { senderId: 13, talkSphereId, content: value, createdAt}

                insertFormattedDate(dataSent)
                console.log(dataSent)
                setUsersTemporaryChat((previous)=>(
                        {
                            id: talkSphereId,
                            messages: [...previous.messages ?? [], dataSent]
                        }
                ))
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
                        sendMessage()
                    }
                }}
            />
            <div className={styles.recorders}>
                <AudioRecognition />
                <AudioRecorder />
            </div>
        </div>
     );
}

MessageSender.propTypes = {
    talkSphereId: PropTypes.number,
    currentChatId: PropTypes.number,
    fullBackgroundOpacity: PropTypes.number
}
 
export default MessageSender;