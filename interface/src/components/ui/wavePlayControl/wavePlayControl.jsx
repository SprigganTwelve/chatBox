import PropTypes from 'prop-types'

import SVGpause from "/src/assets/svg/pause-svgrepo-com.svg";
import SVGplayaudiowhite from "/src/assets/svg/play-alt-svgrepo-com-white.svg";

import styles from './wave.play.control.module.css'


const WavePlayControl = ({
    isPlaying,
    customeStyle,
    togglePlayback
}) => {

    return ( 
        <img
            style={customeStyle}
            className={styles.icon}
            onClick={togglePlayback}
            alt={isPlaying ? "Pause audio" : "Play audio"}
            src={isPlaying ? SVGpause : SVGplayaudiowhite}
        />
     );
}
 
export default WavePlayControl;

WavePlayControl.propTypes = {
    isPlaying: PropTypes.bool,
    togglePlayback: PropTypes.func,
    customeStyle: PropTypes.object,
}