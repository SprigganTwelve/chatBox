
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types'

import styles from "./about.overlay.module.css"


const AboutOverlay = ({
    text,
    children
}) => {

    const overlayRef = useRef(null)
    const [showText, setShowText] = useState(false)

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
            style={ showText ? { "--overlayText": `"${ text ?? ""}"`} : null }
        >
            { children }
        </div>
     );
}
 
export default AboutOverlay;

AboutOverlay.propTypes = {
    text: PropTypes.string,
    children: PropTypes.node,
}