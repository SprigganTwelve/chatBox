
import PropTypes from 'prop-types'
import { useContext, useState } from "react";
import SVGsend from "/src/assets/svg/send-email-svgrepo-com.svg"
import styles from './message.sender.module.css'
import { insertFormattedDate } from "/src/utils/function"
import { ChatBoxApiContext } from "../../../../context/context";


const MessageSender = ({ talkSphereId,  currentChatId}) => {

    const [value, setValue] = useState("")
    const { socket, userId, usersTemporaryChat, setUsersTemporaryChat } = useContext(ChatBoxApiContext)

    const sendMessage = async () => {
        try{
            if(socket){
                const createdAt = new Date();
                socket.current.emit("privateMessage",{ senderId: userId, receiverId: currentChatId , talkSphereId, content: value, createdAt })
                const dataSent = { senderId:13, talkSphereId, content: value, createdAt}

                insertFormattedDate(dataSent)
                console.log(dataSent)
                setUsersTemporaryChat((previous)=>(
                        {
                            id: talkSphereId,
                            messages: [...previous.messages, dataSent]
                        }
                ))
                console.log(usersTemporaryChat)

            }
        }
        catch(error){
            console.log(error)
        }
    }


    return ( 
        <div className={styles.container}>
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
            <img src={SVGsend} alt="search" onClick={()=>{
                sendMessage()
            }} />
        </div>
     );
}

MessageSender.propTypes = {
    talkSphereId: PropTypes.number,
    currentChatId: PropTypes.number
}
 
export default MessageSender;