import PropTypes from "prop-types"
import { useState } from "react"

import SVGpause from "/src/assets/svg/pause-svgrepo-com.svg"
import SVGplayaudiowhite from "/src/assets/svg/play-alt-svgrepo-com-white.svg"

import styles from "./message.buddle.module.css"


const MessageBuddle = (
    {
        time,
        media,
        content,
        isSent = true,
        backgroundColor,
        containerStyle = {},
    }
) => {

    const [ isPause, setIsPause ] = useState(false)

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

            {
                media && (
                    <div className={styles.audioSection} >
                        {
                            isPause ? (
                                <img 
                                    alt="Pause audio"
                                    src={ SVGpause }
                                    className={styles.audioPlay}
                                    onClick={ () => setIsPause((previous)=> !previous)}
                                />
                             
                                ) : (
                                <img 
                                    alt="Start audio"
                                    src={ SVGplayaudiowhite }
                                    className={styles.audioPlay}
                                    onClick={ () => setIsPause((previous)=> !previous)}
                                />
                            )
                        }
                            <div className={styles.gaugeContainer}>
                            <div className={styles.gauge} />
                        </div>
                    </div>
                )
            }
            <p className={styles.message} >{content}</p>
            <div className={styles.time}>{time}</div>
        </div>
     );
}

MessageBuddle.propTypes = {
    time: PropTypes.string,
    isSent: PropTypes.bool,
    media: PropTypes.object,
    content: PropTypes.string,
    containerStyle: PropTypes.object,
    backgroundColor: PropTypes.string
}
 
export default MessageBuddle;