import { useState, useRef, useContext, useCallback } from 'react'
import PropTypes from 'prop-types'

import styles from './audio.recorder.module.css'

import SVGvoicerecorder from '/src/assets/svg/callrecorder.svg'
import SVGsend from '/src/assets/svg/send-email-svgrepo-com.svg'
import SVGclose from '/src/assets/svg/close-circle-svgrepo-com.svg'

import { ChatBoxApiContext } from '/src/context/context'
import CoundtDown from '/src/components/ui/countdown/countdown'


const AudioRecorder = ({ onSend = ()=>{} }) => {

    const chunks = useRef([])                               // Store chunks in useRef to persist across re-renders
    const mediaRecorder = useRef(null)
    const { setPopUp } = useContext(ChatBoxApiContext)
    const [ isRecording, setIsRecording ] = useState(false)
    const [ countdownManager, setCountdownManager ] = useState({
        reset: false,
        pause: true,
        newDuration: 0
    })
    

    const startRecording = useCallback( async () => {
        const stream = await navigator.mediaDevices.getUserMedia( { audio: true } )
        mediaRecorder.current = new MediaRecorder(stream)

        mediaRecorder.current.ondataavailable = (event) => {
            chunks.current.push(event.data)  
        }

        mediaRecorder.current.onstop = ()=> {
            const blob = new Blob(chunks.current, { type: "audio/webm" })
            onSend(blob)                                                        // callback for retreiving the blob object from the parent component
        }

        mediaRecorder.current.onerror = (err) => {
            console.log("Error: ", err)
            if(setPopUp) setPopUp(() => ({ message: "Something unexpected happen" }))
        }

        mediaRecorder.current.onstart = () => {
            setIsRecording(() => true)
        }

        // Start the recording
        mediaRecorder.current.start()

        setCountdownManager(( previous )=> ({ ...previous, pause: false }))

    }, [onSend, setPopUp])


    // Reset the recording process
    const resetRecording = useCallback(() => {
        if (mediaRecorder.current?.stream) {
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        }
        chunks.current = []
        setIsRecording(false);
        setCountdownManager((previous)=> ({ ...previous, reset: true, pause: true }))
    }, [])


    // Stop the media recorder and cleanup
    const sendAudioHandlers = useCallback(async () => {
        if (mediaRecorder.current && mediaRecorder.current.stream) {
            await mediaRecorder.current.stop()
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
    }, [])

    
    return (
        <div>
            {!isRecording && (
                <div>
                    <img
                        src={SVGvoicerecorder}
                        className={styles.icon}
                        onClick={startRecording}
                    />
                </div>
            )}

            {isRecording && (
                <div className={styles.recordContainer}>
                    <img
                        src={SVGclose}
                        className={styles.icon}
                        onClick={resetRecording}
                    />
                    <div className={styles.slideSection}>
                        <CoundtDown { ...countdownManager } />
                        <div className={styles.redRecorderButton} />
                        <div className={styles.gauge} />
                    </div>
                    <img
                        src={SVGsend}
                        className={styles.icon}
                        onClick={sendAudioHandlers}
                    />
                </div>
            )}
        </div>
    );
}

AudioRecorder.propTypes = {
    onSend: PropTypes.func
}

export default AudioRecorder;
