

import { useEffect, useRef, useState, useCallback } from "react";
import propTypes from "prop-types"

import styles from "./countdown.module.css"

const CoundtDown = ({
    pause,
    reset,
    newDuration
}) => {

    const timer = useRef()
    const [ audioDuration, setAudioDuration ] = useState(null);
    const [ audioCountdown, setAudioCountdonwn ] = useState(0)

    useEffect(() => {
        if (!pause) {
            timer.current = setInterval(() => {
                setAudioCountdonwn((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(timer.current);
        }
    
        return () => clearInterval(timer.current);
    }, [pause]);
    

    

    // Convert the audio countdown to a human-readable format (hours-minutes-seconds)

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

    //Here we handle the reset

    useEffect(() => {
        if (reset) {
            clearInterval(timer.current);
            setAudioCountdonwn(0);
            setAudioDuration({ hours: 0, minutes: 0, seconds: 0 });
        }
    }, [reset]);
    
    useEffect(() => {
        if (
            newDuration &&
            !isNaN(newDuration.hours) &&
            !isNaN(newDuration.minutes) &&
            !isNaN(newDuration.seconds)
        ) {
            setAudioDuration(newDuration);
        }
    }, [newDuration]);

    return ( 
            <p className={styles.p}>
                {audioDuration &&
                    `${audioDuration.hours !== 0
                            ? audioDuration.hours.toString().padStart(2, '0') + ':'
                            : ''}${audioDuration.minutes.toString().padStart(2, '0')}:${audioDuration.seconds.toString().padStart(2, '0')}`
                }
            </p>
     );
}
 
export default CoundtDown;

CoundtDown.propTypes = {
    pause: propTypes.bool,
    reset: propTypes.bool,
    newDuration: propTypes.number
}