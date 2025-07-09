
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types'

import SVGplay from '/src/assets/svg/play-alt-svgrepo-com-white.svg'

import styles from './video.frame.snapper.module.css'

const VideoFrameSnapper = ({ file, imageStyle= {}, cutPoint = 6, httpUrl }) => {

    const videoRef = useRef()
    const canvasRef = useRef()

    useEffect(()=>{

        if(!file) return

        const videoElement = videoRef.current
        const canvasElement = canvasRef.current

        const context = canvasElement.getContext('2d')

        if(!videoElement && !canvasElement) return

        videoElement.src = file ? URL.createObjectURL(file) : httpUrl

        const handleLoadedData  = () => {

            const parent = canvasElement.parentElement;
            const canvasW = parent.offsetWidth;
            const canvasH = parent.offsetHeight;

            canvasElement.width = canvasW;
            canvasElement.height = canvasH;

            videoElement.currentTime = videoElement.duration > cutPoint ? cutPoint : 0;

            //we simulate an cover (object-fit) effect and then crop the image
            videoElement.onseeked = () => {
                    const videoW = videoElement.videoWidth;
                    const videoH = videoElement.videoHeight;

                    const videoRatio = videoW / videoH;
                    const canvasRatio = canvasW / canvasH;

                    let sx, sy, sWidth, sHeight;

                if (videoRatio > canvasRatio) {
                    sHeight = videoH;
                    sWidth = videoH * canvasRatio;
                    sx = (videoW - sWidth) / 2;
                    sy = 0;
                } else {
                    sWidth = videoW;
                    sHeight = videoW / canvasRatio;
                    sx = 0;
                    sy = (videoH - sHeight) / 2;
                }

                context.drawImage(videoElement, sx, sy, sWidth, sHeight, 0, 0, canvasW, canvasH);
            };
        };


        videoElement.addEventListener("loadeddata", handleLoadedData)
        
        return ()=>{
            videoElement.removeEventListener("loadeddata", handleLoadedData)
        }
    

    },[file])

    return ( 
        <div 
            className={styles.main}
        >
            <video
                hidden
                ref={videoRef}
            />
            <canvas
                ref={canvasRef}
                style={imageStyle}
                className={styles.canvas}
            />
            <div className={styles.iconContainer}> 
                <img src={SVGplay} className={styles.icon} />
            </div>
        </div>
     );
}
 
export default VideoFrameSnapper;

VideoFrameSnapper.propTypes = {
    file: PropTypes.object,
    httpUrl: PropTypes.string,
    cutPoint: PropTypes.number,
    imageStyle: PropTypes.object
}