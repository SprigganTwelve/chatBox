import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

import SVGpause from "/src/assets/svg/pause-svgrepo-com.svg";
import SVGplayaudiowhite from "/src/assets/svg/play-alt-svgrepo-com-white.svg";

import styles from './audio.reader.module.css';

const AudioReader = ({ media, talkSphereFolder }) => {
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgression, setAudioProgression] = useState(0);

  const audioRef = useRef(null);
  const animationRef = useRef(null);

  const updateProgress = () => {
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setAudioProgression( (current / total) * 100 );
    animationRef.current = requestAnimationFrame( updateProgress );
  };



  useEffect(() => {

    if (!media?.name || !talkSphereFolder) return;

    const audio = audioRef.current;
    const audioPath = `http://localhost:3000/uploads/talkspheres/${talkSphereFolder}/audios/${media.name}`
    
    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgression(0);
      cancelAnimationFrame(animationRef.current);
    };

    const handleLoadedMetaData = ()=> {
      console.log("Audio Loaded meta data : ", audio.duration)
    }

    const handleError =  (e) => {
      console.error("Erreur lors du chargement de l'audio :", e);
    }
    
    audio.addEventListener("loadedmetadata", handleLoadedMetaData)
    audio.addEventListener( "ended", handleEnded );
    audio.addEventListener("error", handleError);

    audio.setAttribute( "src", audioPath );

    if ( audio.src !== audioPath ) {
      audio.setAttribute( "src", audioPath );
    }

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData)
      audio.removeEventListener("error", handleError)
    };

  }, [media.name, talkSphereFolder]);
  

  // switch to play or pause

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
    } 
    else {
      audio.play().then(() => {
          animationRef.current = requestAnimationFrame(updateProgress);
          setIsPlaying(true);
      })
      .catch((err) => {
          console.warn("Erreur de lecture audio :", err);
      });
    }
  };


  return (
    <div className={styles.audioSection}>
      <audio
        hidden
        preload="auto"
        ref={ audioRef }
      >
      </audio>

      <img
        alt={isPlaying ? "Pause audio" : "Play audio"}
        src={isPlaying ? SVGpause : SVGplayaudiowhite}
        className={styles.icon}
        onClick={togglePlayback}
      />

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
  progressorWidth: PropTypes.number,
  talkSphereFolder: PropTypes.string,
};

export default AudioReader;
