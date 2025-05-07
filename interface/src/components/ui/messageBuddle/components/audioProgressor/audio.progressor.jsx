import PropTypes from "prop-types"
import { useState, useEffect } from "react"

import SVGpause from "/src/assets/svg/pause-svgrepo-com.svg"
import SVGplayaudiowhite from "/src/assets/svg/play-alt-svgrepo-com-white.svg"

import styles from './audio.progressor.module.css'

const AudioProgressor = ({ media, talkSphereFolder }) => {
    
    const [ audio, setAudio ] = useState(null)
    const [ audioProgression, setAudioProgression ] = useState(0)
    const [ isPause, setIsPause ] = useState(false)

    useEffect(() => { ///MUST LIMIT IT
        if (!media || !talkSphereFolder) return;
      
        const audioUrl = `http://localhost:3000/uploads/talkspheres/${talkSphereFolder}/audios/${media.name}`;
        const audioObj = new Audio(audioUrl);
        setAudio(audioObj);
        audioObj.preload = 'auto';

        const updateProgress = () => {
          if (audioObj.duration) {
            const progress = (100 * audioObj.currentTime) / audioObj.duration;
            setAudioProgression(progress);
          }
        };
      
        audioObj.addEventListener("timeupdate", updateProgress);
      
        audioObj.addEventListener("ended", () => {
          setIsPause(false);
          setAudioProgression(0);
        });
      
        return () => {
          audioObj.pause();
          audioObj.removeEventListener("timeupdate", updateProgress);
          setAudio(null);
        };
      }, [media, media.name, talkSphereFolder]);      


    return ( 
        <div className={styles.audioSection} >
                {
                    isPause ? (
                        <img 
                            alt="Pause audio"
                            src={ SVGpause }
                            className={styles.icon}
                            onClick={ () => {
                               if(audio){
                                    audio.pause()
                                    setIsPause((previous) => !previous)
                               }
                            }}
                        />
                    
                        ) : (
                        <img 
                            alt="Start audio"
                            src={ SVGplayaudiowhite }
                            className={styles.icon}
                            onClick={ () => {
                                if(audio){
                                    audio.play()
                                    setIsPause((previous) => !previous)
                               }
                            }}
                        />
                    )
                }
                <div 
                    className={styles.gaugeContainer}
                >
                    <div 
                        className={styles.gauge}
                        style={{ width: `${audioProgression || 0}%` }}
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
        name: PropTypes.string,
    }),
    progressorWidth: PropTypes.number,
    talkSphereFolder: PropTypes.string
}