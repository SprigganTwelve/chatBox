import { useContext } from "react";
import PropTypes from "prop-types"
import { ChatBoxApiContext } from "../../../context/context"
import styles from "./message.buddle.module.css"

const MessageBuddle = (
    {
        content,
        time,
        sender,
        backgroundColor
    }
) => {

    const { currentChatId } = useContext(ChatBoxApiContext)

    return ( 
        <div style={{ 
                backgroundColor: backgroundColor,
                "--dynamic-color": backgroundColor ?? "#0078ff"
            }}
            className={`${styles.bubble} 
                ${ sender !== currentChatId ? styles.sent 
                : styles.received}`}
            >
            <p className={styles.message} >{content}</p>
            <div className={styles.time}>{time}</div>
        </div>
     );
}

MessageBuddle.propTypes = {
    content: PropTypes.string,
    time: PropTypes.string,
    sender: PropTypes.number,
    backgroundColor: PropTypes.string
}
 
export default MessageBuddle;