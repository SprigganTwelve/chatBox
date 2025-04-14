import { useState, useRef } from 'react'
import PropTypes from 'prop-types'

import styles from './audio.recorder.module.css'

import SVGvoicerecorder from '/src/assets/svg/callrecorder.svg'
import SVGsend from '/src/assets/svg/send-svgrepo-com.svg'
import SVGclose from '/src/assets/svg/close-circle-svgrepo-com.svg'


const AudioRecorder = ({ onSend }) => {

        const mediaRecorder = useRef(null)
        const [isRecording, setIsRecording] = useState(false)
        const [audioBlob, setAudioBlob] = useState(null)
    
        
        const startRecording = async () => {
            const stream = await navigator.mediaDevices.getUserMedia( { audio: true } )
            mediaRecorder.current = new MediaRecorder(stream)
            let chunks = []
    
            mediaRecorder.current.onedataavailable = (event) => {
                chunks.push(event.data)
            }
    
            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(chunks, {type: "audio/webm"})
                setAudioBlob(audioBlob)
            }
    
            mediaRecorder.current.start = ()=> {
                setIsRecording(true)
            }
        }
        
    
        const stopRecording = ()=>{
            if(audioBlob) {
                mediaRecorder.current.stop();
            }
        }
    
        const sendAudio = ()=>{
            if(audioBlob) onSend(audioBlob)
        }

    
    return ( 
        <div>
            {
                isRecording && (
                    <>
                        <img 
                            src={SVGclose}
                            className={styles.icon}
                            onClick={stopRecording}
                        />
                        
                        <img 
                            src={SVGsend}
                            className={styles.icon}
                            onClick={sendAudio}
                        />
                    </>
                )
            }
            { !audioBlob && !isRecording && (
                    <div>
                        <img 
                            src={ SVGvoicerecorder }
                            className={styles.icon}
                            onClick={startRecording}
                        />
                    </div>
                )
            }
        </div>
     );
}



AudioRecorder.propTypes = {
    onSend: PropTypes.func
}

export default AudioRecorder;