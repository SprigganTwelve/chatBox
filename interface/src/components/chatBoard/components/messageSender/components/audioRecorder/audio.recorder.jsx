import { useState, useRef, useContext, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import styles from './audio.recorder.module.css'

import SVGvoicerecorder from '/src/assets/svg/callrecorder.svg'
import SVGsend from '/src/assets/svg/send-email-svgrepo-com.svg'
import SVGclose from '/src/assets/svg/close-circle-svgrepo-com.svg'
import { ChatBoxApiContext } from '/src/context/context'


const AudioRecorder = ({ onSend = ()=>{} }) => {

    const timer = useRef(null)
    const mediaRecorder = useRef(null)
    const chunks = useRef([])  // Store chunks in useRef to persist across re-renders
    const { setPopUp } = useContext(ChatBoxApiContext)
    const [ audioCountdown, setAudioCountdonwn ] = useState(0)
    const [ isRecording, setIsRecording ] = useState(false)
    const [ audioDuration, setAudioDuration ] = useState(null);
    

    const startRecording = useCallback( async () => {
        const stream = await navigator.mediaDevices.getUserMedia( { audio: true } )
        mediaRecorder.current = new MediaRecorder(stream)

        mediaRecorder.current.ondataavailable = (event) => {
            chunks.current.push(event.data)  
            console.log("chunks : ", chunks.current)
        }

        mediaRecorder.current.onstop = ()=> {
            const blob = new Blob(chunks.current, { type: "audio/webm" })
            onSend(blob)  
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

        timer.current = setInterval(() => {
            setAudioCountdonwn((previous) => previous + 1)
        }, 1000)

    }, [onSend, setPopUp])


    // Reset the recording process
    const resetRecording = useCallback(() => {
        if (mediaRecorder.current?.stream) {
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        }

        chunks.current = []
        setAudioCountdonwn(0);
        setIsRecording(false);
        setAudioDuration(null);
        clearInterval(timer.current);
    }, [])


    // Stop the media recorder and cleanup
    const sendAudioHandlers = useCallback(async () => {
        if (mediaRecorder.current && mediaRecorder.current.stream) {
            await mediaRecorder.current.stop()
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
    }, [])


    // Convert the audio countdown to a human-readable format
    const convertDuration = useCallback(() => {
        if (audioCountdown) {
            const seconds = audioCountdown % 60
            const minutes = Math.trunc(audioCountdown / 60);
            const hours = Math.trunc(minutes / 60);
            setAudioDuration({
                hours, minutes, seconds
            })
        }
    }, [audioCountdown])


    useEffect(() => {
        convertDuration()
    }, [convertDuration])

    
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
                        <p className={styles.p}>
                            {audioDuration &&
                                `${audioDuration.hours !== 0
                                    ? audioDuration.hours.toString().padStart(2, '0') + ':'
                                    : ''}${audioDuration.minutes.toString().padStart(2, '0')}:${audioDuration.seconds.toString().padStart(2, '0')}`
                            }
                        </p>
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
