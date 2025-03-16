import {  useEffect, useState } from "react";
import PropTypes from 'prop-types'
import Cropper from 'react-easy-crop'

import styles from "./smart.image.processor.module.css"
import Slider from "/src/components/ui/slider/silider";

import SVGrotation from '/src/assets/svg/rotation-svgrepo-com.svg'
import SVGfilter from '/src/assets/svg/filter-options-preferences-settings-svgrepo-com.svg'
import SVGblur from '/src/assets/svg/blur-svgrepo-com.svg'
import SVGannotation from '/src/assets/svg/pencil-svgrepo-com.svg'
import SVGimport from '/src/assets/svg/import-svgrepo-com.svg'
import SVGluminosity from '/src/assets/svg/luminosity-svgrepo-com.svg'

const SmartImageProcessor = ({ file }) => {

    // const { setModal } = useContext(ChatBoxApiContext)

    const [ zoom, setZoom ] = useState(1)
    const [crop, setCrop] = useState({ x:0, y:0 })
    const [rotation, setRotation] = useState(0)
    

    const onCropComplete = () => {

    }

    useEffect(()=>{

    },[])

    return ( 
        <div className={styles.container}>
            <div className={styles.menu}>
                <div className={styles.iconContainer}>
                    <img className={styles.icon} src={SVGrotation} alt="image" />
                    <span>Rotation</span>
                </div>
                <div className={styles.iconContainer}>
                    <img className={styles.icon}  src={SVGfilter} alt="image" />
                    <span>Filter</span>
                </div>
                <div className={styles.iconContainer}>
                    <img className={styles.icon}  src={SVGblur} alt="image"/>
                    <span>Blur</span>
                </div>
                <div className={styles.iconContainer}> 
                    <img className={styles.icon}  src={SVGannotation} alt="image" />
                    <span>Annotation</span>
                </div>
                <div className={styles.iconContainer}> 
                    <img className={styles.icon}  src={SVGimport} alt="image" />
                    <span>import</span>
                </div>
            </div>
            <div className={styles.cropContainer}>
                <Cropper
                    image={file}
                    crop={crop}
                    aspect={1}
                    zoom={zoom}
                    cropShape="round"
                    showGrid={false}
                    rotation={rotation}
                    style={{containerStyle: {width: '100%', height: '100%'}}}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                />
            </div>
            <Slider leading={SVGluminosity} containerStyles={ { rigth: '400px', bottom: "10px", position: 'absotlute', }}/>
        </div>
     );
}

SmartImageProcessor.proTypes = {
    file: PropTypes.string,
}
 
export default SmartImageProcessor;