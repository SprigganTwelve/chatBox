import axios from "axios";
import { useEffect } from "react";

import styles from "./message.content.module.css"

const MessageContent = ({currentChatId}) => {

    useEffect(()=>{
        const fetchUserChat = axios.get(`http://localhost:3000/users/messages/4/${currentChatId}`)
    }, [currentChatId])



    return ( 
        <div className={styles.container}>
            <div>
                <p>Salue comment tu vas ça fait un baille</p>
                <span>12:20:30</span>
            </div>
            <div>
                <p>Ouais ça va et de ton côté</p>
                <span>12:20:30</span>
            </div>
        </div>
     );
}
 
export default MessageContent;