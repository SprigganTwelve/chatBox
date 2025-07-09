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
    const total = audioRef.current.duration || 1;
    setAudioProgression((current / total) * 100);
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  useEffect(() => {
    const audio = audioRef.current;
  
    const handleDurationFix = () => {
      if (audio.duration === Infinity) {
        audio.currentTime = 1e101;              // make the current time so big to force the duration updating 
        audio.ontimeupdate = () => {
          audio.ontimeupdate = null;
          audio.currentTime = 0;
        };
      }
    };
  
    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgression(0);
      cancelAnimationFrame(animationRef.current);
    };
  
    audio.addEventListener("loadedmetadata", handleDurationFix);
    audio.addEventListener("ended", handleEnded);
  
    return () => {
      audio.removeEventListener("loadedmetadata", handleDurationFix);
      audio.removeEventListener("ended", handleEnded);
    };

  }, []);
  

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        animationRef.current = requestAnimationFrame(updateProgress);
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Erreur de lecture audio :", err);
      });
    }
  };

  if (!media || !talkSphereFolder) return null;

  return (
    <div className={styles.audioSection}>
      <audio
        hidden
        ref={audioRef}
        preload="metadata"
      >
        <source
          src={`http://localhost:3000/uploads/talkspheres/${talkSphereFolder}/audios/${media.name}`}
          type="audio/webm"
        />
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
