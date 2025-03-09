import PropTypes from "prop-types"
import styles from "./message.buddle.module.css"

const MessageBuddle = (
    {
        time,
        isSent = true,
        content,
        containerStyle = {},
        backgroundColor
    }
) => {

    return ( 
        <div style={{ 
                backgroundColor: backgroundColor,
                "--dynamic-color": backgroundColor ?? "#0078ff",
                ...containerStyle
            }}
            className={`${styles.bubble} 
                ${ isSent ? styles.sent 
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
    isSent: PropTypes.bool,
    containerStyle: PropTypes.object,
    backgroundColor: PropTypes.string
}
 
export default MessageBuddle;