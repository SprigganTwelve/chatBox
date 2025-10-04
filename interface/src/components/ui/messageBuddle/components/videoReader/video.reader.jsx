
import PropTypes from 'prop-types'

import VideoFrameSnapper from "/src/components/ui/VideoframeSnapper/video.frame.snapper";

import styles from './video.reader.module.css'



const VideoReader = ({ name, talkSphereFolder, baseApiURL }) => {
    
    
    return ( 
        <div className={styles.container}>
            <VideoFrameSnapper
                onClick={ ()=> window.open(`${baseApiURL.current}/uploads/talkspheres/${talkSphereFolder}/videos/${name}`, '_blank') }
                httpUrl = {`${baseApiURL.current}/uploads/talkspheres/${talkSphereFolder}/videos/${name}`}
            />
        </div>
     );
}
 
export default VideoReader;

VideoReader.propTypes = {
    name: PropTypes.string,
    talkSphereFolder: PropTypes.string,
}