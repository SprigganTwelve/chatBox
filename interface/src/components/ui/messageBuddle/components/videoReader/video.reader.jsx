
import PropTypes from 'prop-types'

import VideoFrameSnapper from "/src/components/ui/VideoframeSnapper/video.frame.snapper";

import styles from './video.reader.module.css'

const VideoReader = ({ name, talkSphereFolder }) => {

    if(name && talkSphereFolder) 
        console.log(`http://localhost:${import.meta.env.VITE_API_PORT}/uploads/talkspheres/${talkSphereFolder}/videos/${name}`)
    
    return ( 
        <div className={styles.container}>
            <VideoFrameSnapper 
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