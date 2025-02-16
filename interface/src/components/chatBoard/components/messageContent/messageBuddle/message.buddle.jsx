import { useContext } from "react";
import { ChatBoxApiContext } from "../../../../../context/context"
import styles from "./message.buddle.module.css"

const MessageBuddle = (
    {
        content,
        time,
        sender
    }
) => {

    const { currentChatId } = useContext(ChatBoxApiContext)

    return ( 
        <div className={`${styles.bubble} ${ sender !== currentChatId ? styles.sent : styles.received}`}>
            <p className={styles.message} >{content}</p>
            <div className={styles.time}>{time}</div>
        </div>
     );
}
 
export default MessageBuddle;