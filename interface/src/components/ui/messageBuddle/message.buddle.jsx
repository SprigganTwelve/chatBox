import PropTypes from "prop-types"

import AudioReader from './components/audioReader/audio.reader'
import VideoReader from './components/videoReader/video.reader'

import styles from "./message.buddle.module.css"
import PhotoReader from "./components/photoReader/photoReader"
import DocumentReader from "./components/documentReader/documentReader"
import { useContext, useEffect } from "react"
import { useState } from "react"
import { ChatBoxApiContext } from "/src/context/context"


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

    const { baseApiURL } = useContext(ChatBoxApiContext)
    const [enableContainerBackgroundColor, setEnableContainerBackgroundColor] = useState(true) 

    useEffect(() => {
        if (Array.isArray(media)) {
            const hasVisualMedia = media.some(item => item?.type && (item.type.includes("image") || item.type.includes("video") || item.type.includes("document")));
            setEnableContainerBackgroundColor(!hasVisualMedia);
        }
    }, [media]);

    return ( 
      <div
            style={{ 
                            backgroundColor: backgroundColor,
                            "--sender-border-dynamic-color"         : backgroundColor ? backgroundColor 
                                                                            : enableContainerBackgroundColor ? "#0078ff" : "", 
                            "--sender-container-background-color"   : enableContainerBackgroundColor ? "#0078ff" : "",
                            "--receive-border-background-color"     : enableContainerBackgroundColor ? "#e0e0e0" : "", 
                            "--receiver-container-background-color" : enableContainerBackgroundColor ? "#e0e0e0" : "",
                            ...containerStyle
            }}
            className={`
                ${ styles.wrapper }
                ${ isSent ? styles.sent : styles.received } 

            `}
      >
            <div
                className={`${styles.bubble}
                        ${ (content && !Array.isArray(media))  ? styles.textOrAudioBoxOnly : "" }
                    `}
            >

                {
                    Array.isArray(media) ?
                        ( 
                            media.length > 0  && media[0].type.includes('audio') && media[0].name ? (
                                <AudioReader
                                    media={ media[0] }
                                    baseApiURL = {baseApiURL}
                                    talkSphereFolder= { talkSphereFolder  }
                                />
                            )
                            : media.map((item, index)=>{
                                return (
                                    <div key={index} className={ styles.videoAndImageSection }>
                                        {
                                        item.type.includes("video")
                                        ?   <VideoReader 
                                                key={ index }
                                                name = { item.name }
                                                baseApiURL= {baseApiURL}
                                                talkSphereFolder = { talkSphereFolder }
                                            />
                                        : item.type.includes('image') ?
                                                <PhotoReader
                                                    key={ index }
                                                    name = { item.name }
                                                    baseApiURL = {baseApiURL}
                                                    talkSphereFolder = { talkSphereFolder }
                                                />
                                        :       <DocumentReader
                                                    key={ index }
                                                    baseApiURL= {baseApiURL}
                                                />
                                        }
                                    </div>
                                )
                            })
                        )
                        :
                        (
                            <></>
                        )
                }
                {
                    content && content.length > 0 && (
                        <div>
                            <p className={styles.message} >{content}</p>
                        </div>
                    )
                }
                <div className={styles.time}>{time}</div>
            </div>
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