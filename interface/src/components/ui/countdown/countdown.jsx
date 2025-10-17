

import { useEffect, useRef, useState, useCallback } from "react";
import propTypes from "prop-types"

import styles from "./countdown.module.css"
import { convertDuration } from "/src/utils/time.utils";



const CoundtDown = ({
    pause,
    reset,
    start = null,
    onPause = ()=>{}
}) => {

    const timer = useRef()
    const [ audioDuration, setAudioDuration ] = useState(null);
    const [ audioCountdown, setAudioCountdonwn ] = useState(0)

    const countdownRef = useRef(0);

    useEffect(() => {
        countdownRef.current = audioCountdown;
    }, [audioCountdown]);

    
    useEffect(() => {
        if (reset) {
            clearInterval(timer.current);
            setAudioCountdonwn(0);
            setAudioDuration(null);
            return;
        }

        if (!pause) {
            clearInterval(timer.current);    // clean old interval
            timer.current = setInterval(() => {
                setAudioCountdonwn(prev => prev + 1);
            }, 1000);
        }
        else {
            clearInterval(timer.current);
            onPause(countdownRef.current);          // use ref for updating
        }

        return () => clearInterval(timer.current);
    }, [pause, reset]);


    //generate duration 
    
    useEffect(() => {
        const duration = convertDuration(audioCountdown)
        setAudioDuration(duration)
    }, [audioCountdown])

    //define a start for the countdown

    useEffect(() => {
        if (start != null) {
            setAudioCountdonwn(start);
        }
    }, [start]);


    //reset the countdown and the duration

    useEffect(() => {
        if (reset) {
            clearInterval(timer.current);
            setAudioCountdonwn(0);
            setAudioDuration(null);
        }
    }, [reset]);


    if( audioCountdown === 0 )
            return <span className={styles.span}>00:00</span>


    return ( 
            <span className={styles.span}>
                {audioDuration &&
                    `${audioDuration.hours !== 0
                            ? audioDuration.hours.toString().padStart(2, '0') + ':'
                            : ''}${audioDuration.minutes.toString().padStart(2, '0')}:${audioDuration.seconds.toString().padStart(2, '0')}`
                }
            </span>
     );
}

 
export default CoundtDown;

CoundtDown.propTypes = {
    pause: propTypes.bool,
    reset: propTypes.bool,
    start: propTypes.number,
    onPause: propTypes.func
}