import PropTypes from 'prop-types'
import { useState, useRef, useContext, useCallback } from 'react'

import { ChatBoxApiContext } from '/src/context/context'

import SVGvoicerecorder from '/src/assets/svg/callrecorder.svg'
import SVGclose from '/src/assets/svg/close-circle-svgrepo-com.svg'


import CoundtDown from '/src/components/ui/countdown/countdown'
import WavePlayControl from "/src/components/ui/wavePlayControl/wavePlayControl";

import styles from './audio.recorder.module.css'
import clsx from 'clsx'



const AudioRecorder = ({ 
    mediaRecorderRef,
    onDataAvailableHandler = ()=> {},
}) => {
                  
    
    const chunks = useRef([])
    const permission = useRef(null)
    const manualStopRef = useRef(false)

    const { setPopUp } = useContext(ChatBoxApiContext)

    const [ isPlaying, setIsPlaying ] = useState(true)      //initial value
    const [ isRecording, setIsRecording ] = useState(false)
    const [ countdownManager, setCountdownManager ] = useState()
    

    
    // Reset the recording process
    const resetRecording = useCallback(() => {
        manualStopRef.current = true
        mediaRecorderRef.current.stop()
        setIsRecording(false);
        setCountdownManager({ pause: true, reset: true })
    }, [])



    const startRecording = useCallback( async () => {
        try{

            if ( mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive" ) {
                mediaRecorderRef.current.stream.getTracks().forEach( track => track.stop() );
                mediaRecorderRef.current.stop();
            }

            if(!permission.current){
                permission.current = (await navigator.permissions.query({ name: 'microphone' }))
            }

            if( permission.current && permission.current.state === "denied" ){
                setPopUp( ()=> ({ message: "Something unexpected happen: Permission is not granted!!", type: "error" }) )
                return
            }

            chunks.current = []


            const stream = await navigator.mediaDevices.getUserMedia( { audio: true } )
            mediaRecorderRef.current = new MediaRecorder(stream)

            const track = stream.getAudioTracks()[0];

            track.onmute = () => console.warn("Micro désactivé (muted)");
            track.onunmute = () => console.log("Micro actif");


            mediaRecorderRef.current.ondataavailable = (event) => {
                if( event.data.size > 0 )
                    chunks.current.push(event.data)  
            }

            mediaRecorderRef.current.onstop = async ()=> {
                try {
                    mediaRecorderRef.current.stream.getTracks().forEach( track => { track.stop() } );

                    if(manualStopRef.current){
                        manualStopRef.current = false
                        return
                    }
                        
                    const blob = new Blob(chunks.current, { type: "audio/webm" });
                    blob.name = Date.now() + '.' + blob.type.split('/')[1];
                    await onDataAvailableHandler(blob);

                } 
                catch (err) {
                    console.error("Something went wrong while sending the audio", err);
                }
                finally {
                    chunks.current = []
                    resetRecording();
                }
            }

            mediaRecorderRef.current.onerror = (err) => {
                console.log("Error: ", err)
                if(setPopUp) setPopUp(() => ({ message: "Something unexpected happen" }))
            }

            mediaRecorderRef.current.onstart = () => {
                setIsRecording(() => true)
            }

            // Start the recording
            mediaRecorderRef.current.start()

            setCountdownManager(( previous )=> ({ reset: false, pause: false }))
        }
        catch(err){
            console.log("Something went wrong while starting recording : ", err)
        }

    }, [ setPopUp ])


    return (
        <div className={styles.audioContainer}>
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
                    <WavePlayControl
                        isPlaying= { isRecording && isPlaying }
                        customeStyle= {{ width: 25, height: 25 }}
                        togglePlayback = { () => {
                            if(isPlaying){
                                mediaRecorderRef.current.pause()
                                setCountdownManager((prev)=> ({ ...prev, pause: true }))
                            }
                            else{
                                mediaRecorderRef.current.resume()
                                setCountdownManager((prev)=> ({ ...prev, pause: false }))
                            }
                                
                            setIsPlaying((prev)=> !prev)
                        }} 
                    />
                    <div className={styles.slideSection}>
                        <CoundtDown { ...countdownManager } />
                        <div className={clsx(styles.redRecorderButton, isPlaying ? styles.pulseAnimation : "")} />
                        <div className={styles.gauge} />
                    </div>
                    <img
                        src={SVGclose}
                        className={styles.icon}
                        onClick={ resetRecording}
                    />
                </div>
            )}
        </div>
    );
}

AudioRecorder.propTypes = {
    mediaRecorderRef: PropTypes.shape({
        current: PropTypes.object | null
    }),
    onDataAvailableHandler: PropTypes.func
}

export default AudioRecorder;
