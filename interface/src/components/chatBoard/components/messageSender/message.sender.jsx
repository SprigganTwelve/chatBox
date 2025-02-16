
import { useContext, useState } from "react";
import SVGsend from "/src/assets/svg/send-email-svgrepo-com.svg"
import styles from './message.sender.module.css'
import { insertFormattedDate } from "/src/utils/function"
import { ChatBoxApiContext } from "../../../../context/context";


const MessageSender = ({ talkSphereId,  currentChatId}) => {

    const [value, setValue] = useState("")
    const { socket, usersTemporaryChat, setUsersTemporaryChat } = useContext(ChatBoxApiContext)

    const sendMessage = async () => {
        try{
            if(socket){
                const createdAt = new Date();
                socket.current.emit("privateMessage",{ senderId: 13, receiverId: currentChatId , talkSphereId, content: value, createdAt })
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
                placeholder='Entrez votre message ici'
                value={value}
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
 
export default MessageSender;