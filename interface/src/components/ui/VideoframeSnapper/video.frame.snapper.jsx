
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types'

import SVGplay from '/src/assets/svg/play-alt-svgrepo-com-white.svg'

import styles from './video.frame.snapper.module.css'

const VideoFrameSnapper = ({ file, imageStyle= {}, cutPoint = 6, httpUrl, onClick }) => {

    const videoRef = useRef()
    const canvasRef = useRef()

    useEffect(() => {
        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;
        if (!videoElement || !canvasElement) return;

        const context = canvasElement.getContext('2d');

        const handleLoadedData = () => {
            const parent = canvasElement.parentElement;
            const canvasW = parent.offsetWidth;
            const canvasH = parent.offsetHeight;

            canvasElement.width = canvasW;
            canvasElement.height = canvasH;

            videoElement.currentTime = videoElement.duration > cutPoint ? cutPoint : 0;

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

        videoElement.addEventListener("loadedmetadata", handleLoadedData);

        // Important : assign after the listener added

        const source = file ? URL.createObjectURL(file) : httpUrl;
        videoElement.setAttribute("src", source);

        return () => {
            videoElement.removeEventListener("loadedmetadata", handleLoadedData);
        };
    }, [cutPoint, file, httpUrl]);


    return ( 
        <div 
            className={styles.main}
            onClick={onClick}
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
    onClick: PropTypes.func,
    httpUrl: PropTypes.string,
    cutPoint: PropTypes.number,
    imageStyle: PropTypes.object,
}