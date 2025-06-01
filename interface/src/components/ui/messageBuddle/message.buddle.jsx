import PropTypes from "prop-types"

import AudioReader from './components/audioReader/audio.reader'
import VideoReader from './components/videoReader/video.reader'

import styles from "./message.buddle.module.css"


const MessageBuddle = (
    {
        time,
        media,
        content,
        isSent = true,
        backgroundColor,
        talkSphereFolder,
        containerStyle = {},
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

            {
                Array.isArray(media) ?
                    ( 
                        media[0].type.includes('audio') ? (
                            <AudioReader
                                media={ media[0] }
                                talkSphereFolder= { talkSphereFolder  }
                            />
                        )
                        : media.map((item, index)=>{
                            return (
                                <VideoReader key={ index }/>
                            )
                        })
                    )
                     :
                    (
                        <></>
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
    media: PropTypes.arrayOf({
        type: PropTypes.string
    }),
    content: PropTypes.string,
    containerStyle: PropTypes.object,
    backgroundColor: PropTypes.string,
    talkSphereFolder: PropTypes.string
}
 
export default MessageBuddle;