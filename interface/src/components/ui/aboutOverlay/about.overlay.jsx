
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types'

import styles from "./about.overlay.module.css"


const AboutOverlay = ({
    text,
    children,
    containerStyles = {},
    positions = [ 0, 0 ]
}) => {

    const overlayRef = useRef(null)
    const [ showText, setShowText ] = useState(false)

    useEffect(() => {
        const overlayHtmlController = overlayRef.current;
        if (!overlayHtmlController) return;
    
        const handleOnMouseEnter = () => {
            setTimeout(() => {
                setShowText(true);
            }, 1000);
        };
    
        const handleOnMouseLeave = () => {
            setTimeout(() => {
                setShowText(false);
            }, 600);
        };

        if("maxTouchPoints" in navigator && navigator.maxTouchPoints > 0){      //check the device type 
            return
        }

        overlayHtmlController.addEventListener("mouseenter", handleOnMouseEnter);
        overlayHtmlController.addEventListener("mouseleave", handleOnMouseLeave);

        return () => {
            overlayHtmlController.removeEventListener("mouseenter", handleOnMouseEnter);
            overlayHtmlController.removeEventListener("mouseleave", handleOnMouseLeave);
        };
    }, []);
    

    return ( 
        <div 
            ref={ overlayRef }
            className={styles.overlay}
            style={ showText ? { 
                "--overlayText": `"${ text ?? ""}"`,
                "--top-position" :  `${ positions[0]  }` ,
                "--right-position" : `${ positions[1]  }` ,
                ...containerStyles
            } : null }
        >
            { children }
        </div>
     );
}
 
export default AboutOverlay;

AboutOverlay.propTypes = {
    text: PropTypes.string,
    children: PropTypes.node,
    positions: PropTypes.array,
    containerStyles: PropTypes.object,
}