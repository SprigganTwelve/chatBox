
import PropTypes from 'prop-types'

import VideoFrameSnapper from "/src/components/ui/VideoframeSnapper/video.frame.snapper";

import styles from './video.reader.module.css'



const VideoReader = ({ name, talkSphereFolder }) => {
    
    
    return ( 
        <div className={styles.container}>
            <VideoFrameSnapper
                onClick={ ()=> window.open(`http://localhost:${import.meta.env.VITE_API_PORT}/uploads/talkspheres/${talkSphereFolder}/videos/${name}`, '_blank') }
                httpUrl = {`http://localhost:${import.meta.env.VITE_API_PORT}/uploads/talkspheres/${talkSphereFolder}/videos/${name}`}
            />
        </div>
     );
}
 
export default VideoReader;

VideoReader.propTypes = {
    name: PropTypes.string,
    talkSphereFolder: PropTypes.string,
}