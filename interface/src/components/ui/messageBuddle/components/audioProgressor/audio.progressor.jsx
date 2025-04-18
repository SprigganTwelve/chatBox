import PropTypes from "prop-types"
import { useState, useEffect } from "react"

import SVGpause from "/src/assets/svg/pause-svgrepo-com.svg"
import SVGplayaudiowhite from "/src/assets/svg/play-alt-svgrepo-com-white.svg"

import styles from './audio.progressor.module.css'

const AudioProgressor = ({ media, talkSphereFolder }) => {
    
    const [ isPause, setIsPause ] = useState(false)
    const [ audioProgressor, setAudioProgressor ] = useState(0)

    useEffect(()=>{
        if(media && talkSphereFolder){
            if(media.blob){
                return
            }
            const audio = new Audio(`http://localhost:3000/uploads/talksphers/${talkSphereFolder}/audio/${media.name}`)
            audio.addEventListener("timeupdate", ()=>{
                if(audio.duration){
                    setAudioProgressor(()=> ((audio.currentTime / audio.duration) * 100))
                }
            })
        }
    },[media])

    return ( 
        <div className={styles.audioSection} >
                {
                    isPause ? (
                        <img 
                            alt="Pause audio"
                            src={ SVGpause }
                            className={styles.icon}
                            onClick={ () => {
                                setIsPause((previous)=> !previous)
                            }}
                        />
                    
                        ) : (
                        <img 
                            alt="Start audio"
                            src={ SVGplayaudiowhite }
                            className={styles.icon}
                            onClick={ () => setIsPause((previous)=> !previous)}
                        />
                    )
                }
                <div className={styles.gaugeContainer}>
                    <div 
                        className={styles.gauge}
                        style={{ width: audioProgressor + '%' }}
                    >
                        <div
                            className={styles.round}
                        />
                    </div>
                </div>
        </div>
     );
}
 
export default AudioProgressor;

AudioProgressor.propTypes = {
    media: PropTypes.shape({
        blob: PropTypes.object,
        name: PropTypes.object,
    }),
    talkSphereFolder: PropTypes.string
}