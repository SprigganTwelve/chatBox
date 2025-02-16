
import { useState } from "react";
import { io } from "socket.io-client"
import SVGsend from "/src/assets/svg/send-email-svgrepo-com.svg"
import styles from './message.sender.module.css'


const MessageSender = ({ talkSphereId }) => {

    const [value, setValue] = useState("")

    const sendMessage = () => {
        try{
            const socket = io("http://localhost:3000")
            socket.emit("message",{senderId: 13, talkSphereId, content: value})

            socket.on('message', (data) => {
                console.log('Message reçu:', data);
            });

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
                    if(event.target.key == "Enter"){
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