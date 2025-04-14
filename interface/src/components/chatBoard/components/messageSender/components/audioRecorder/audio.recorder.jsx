import { useState, useRef, useContext, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import styles from './audio.recorder.module.css'

import SVGvoicerecorder from '/src/assets/svg/callrecorder.svg'
import SVGsend from '/src/assets/svg/send-email-svgrepo-com.svg'
import SVGclose from '/src/assets/svg/close-circle-svgrepo-com.svg'
import { ChatBoxApiContext } from '/src/context/context'


const AudioRecorder = ({ onSend }) => {

    const timer = useRef(null)
    const mediaRecorder = useRef(null)
    const { setPopUp } = useContext(ChatBoxApiContext)
    const [ audioBlob, setAudioBlob ] = useState(null)
    const [ audioDuration, setAudioDuration ] = useState(0)
    const [ isRecording, setIsRecording ] = useState(false)
    const [ audioDurationFormatted, setAudioDurationFormatted ] = useState(null);
    
    //Here we start recording

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
            clearInterval(timer.current)
        }

        mediaRecorder.current.onerror = (err)=>{
            console.log("Error: ", err)
            if(setPopUp) setPopUp(()=> ({ message: "Something unexpected happen"  }) )
        }
    
        mediaRecorder.current.onstart = ()=>{
            setIsRecording(() => true)
            timer.current = setInterval(()=>{
                setAudioDuration((previous) => previous + 1 )
            },1000)
        }

        mediaRecorder.current.start()

    }
        
    //We stop recording

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
            mediaRecorder.current.stop();
        }
    
        if (mediaRecorder.current?.stream) {
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        }
    
        setAudioDuration(0);
        setIsRecording(false);
        clearInterval(timer.current);
        setAudioDurationFormatted(null);
    }
    
    //We pass the handlers when all is okay

    const sendAudioHandlers = ()=>{
        mediaRecorder.current.stop();
        if(audioBlob) onSend(audioBlob)
    }

    //We convert the timer result into something more understable by the user 

    const convertDuration = useCallback( ()=>{
        if(audioDuration){
            const secondes = audioDuration % 60
            const minutes = Math.trunc( audioDuration / 60 ) ;
            const heures  = Math.trunc( minutes / 60 ) ;
            setAudioDurationFormatted({
                heures, minutes, secondes
            })
        }
    }, [audioDuration])


    useEffect(()=>{
        convertDuration()
    },[convertDuration])
        
    
    return ( 
        <div>

            { !isRecording && (
                    <div>
                        <img 
                            src={ SVGvoicerecorder }
                            className={styles.icon}
                            onClick={startRecording}
                        />
                    </div>
                )
            }
            {
                isRecording && (
                    <div className={styles.recordContainer}>
                        <img 
                            src={SVGclose}
                            className={styles.icon}
                            onClick={stopRecording}
                        />
                        <div className={styles.slideSection}>
                            <p className={styles.p}>
                            {audioDurationFormatted &&
                                `${audioDurationFormatted.heures !== 0
                                ? audioDurationFormatted.heures.toString().padStart(2, '0') + ':' 
                                : ''}${audioDurationFormatted.minutes.toString().padStart(2, '0')}:${audioDurationFormatted.secondes.toString().padStart(2, '0')}`
                            }
                            </p>
                            <div className={ styles.redRecorderButton } />
                            <div className={ styles.gauge }/>
                        </div>
                        <img 
                            src={SVGsend}
                            className={styles.icon}
                            onClick={sendAudioHandlers}
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