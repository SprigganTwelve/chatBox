import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";



import styles from './audio.reader.module.css';
import CoundtDown from "/src/components/ui/countdown/countdown";
import WavePlayControl from "/src/components/ui/wavePlayControl/wavePlayControl";


import { convertDuration } from "/src/utils/time.utils";





const AudioReader = ({ media, talkSphereFolder, baseApiURL }) => {

  
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ audioDuration, setAudioDuration ] = useState()
  const [ audioProgression, setAudioProgression ] = useState(0);
  const [ audioCurrentTime, setAudioCurrentTime ] = useState(0)

  const audioRef = useRef(null);

  const audioPath =
    media?.name && talkSphereFolder
      ? `${baseApiURL.current}/uploads/talkspheres/${talkSphereFolder}/audios/${media.name}`
      : null;

  useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      const handleEnded = () => {
          setIsPlaying(false);
          setAudioProgression(0);
      };

      const handleTimeUpdate = () => {
          if (audio.duration) {
            setAudioProgression((audio.currentTime / audio.duration) * 100);
          }
      };

      const handleError = (e) => {
        console.error("Erreur audio :", e);
      };

      const handleLoadedMetatData = ()=>{
          if(audio.duration && !isNaN(audio.duration)){
            const lecturingTime  = convertDuration(audio.duration)
            setAudioDuration(()=> lecturingTime)
          }
      }

      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("error", handleError);
      audio.addEventListener("loadedmetadata", handleLoadedMetatData)

      return () => {
          audio.removeEventListener("ended", handleEnded);
          audio.removeEventListener("timeupdate", handleTimeUpdate);
          audio.removeEventListener("error", handleError);
          audio.removeEventListener("loadedmetadata", handleLoadedMetatData);
      };
  }, [audioPath]);



  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Erreur de lecture audio :", err));
    }
  };



  return (
    <div className={styles.audioSection}>
        <audio hidden preload="auto" ref={audioRef} src={audioPath} />
            <WavePlayControl 
                isPlaying={isPlaying}
                togglePlayback={togglePlayback}
            />
            <div style={{ display: isPlaying ? "initial" : "none" }} className={styles.time}>
                <CoundtDown
                    pause = { !isPlaying }
                    start = { isPlaying ? null : audioCurrentTime }
                    onPause={(audioCountdown)=> setAudioCurrentTime(audioCountdown) }
                />
            </div>
            <span style={{ display: !isPlaying ? "initial" : "none" }} className={styles.time}> 
                  {audioDuration != null &&
                                  `${audioDuration?.hours !== 0
                                          ? audioDuration?.hours?.toString().padStart(2, '0') + ':'
                                          : ''}${audioDuration?.minutes?.toString().padStart(2, '0')}:${audioDuration?.seconds?.toString().padStart(2, '0')}`
                  }
            </span>

          <div className={styles.gaugeContainer}>
              <div
                className={styles.gauge}
                style={{ width: `${audioProgression}%` }}
              >
                <div className={styles.round} />
              </div>
          </div>
    </div>
  );
};

AudioReader.propTypes = {
  media: PropTypes.shape({
    name: PropTypes.string,
  }),
  talkSphereFolder: PropTypes.string,
};

export default AudioReader;
