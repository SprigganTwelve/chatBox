import {  useEffect, useState } from "react";
import PropTypes from 'prop-types'
import Cropper from 'react-easy-crop'

import styles from "./smart.image.processor.module.css"

import Slider from "/src/components/ui/slider/silider";
import MenuItem from "./components/menu.item";

import SVGrotation from '/src/assets/svg/rotation-reset-svgrepo-com.svg'
import SVGfilter from '/src/assets/svg/filter-options-preferences-settings-svgrepo-com.svg'
import SVGblur from '/src/assets/svg/blur-svgrepo-com.svg'
import SVGannotation from '/src/assets/svg/pencil-svgrepo-com.svg'
import SVGimport from '/src/assets/svg/import-svgrepo-com.svg'
import SVGluminosity from '/src/assets/svg/luminosity-svgrepo-com.svg'
import SVGratio from '/src/assets/svg/aspect-ratio-svgrepo-com (1).svg'

const SmartImageProcessor = ({ file, inputRef, showGrid= false }) => {

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
                <MenuItem leading={SVGrotation} title="Rotation"/>
                <MenuItem leading={SVGfilter} title="Filter"/>
                <MenuItem leading={SVGblur} title="Blur"/>
                <MenuItem leading={SVGannotation} title="Annotation"/>
                <MenuItem 
                        title="import"
                        leading={SVGimport}
                        onClick={()=>{
                            inputRef.current.click()
                        }}
                />
                <MenuItem 
                        title="Ratio"
                        leading={SVGratio}
                        onClick={()=>{
                        
                        }}
                />
            </div>
            <div className={styles.cropContainer}>
                <Cropper
                    image={file}
                    crop={crop}
                    aspect={1}
                    zoom={zoom}
                    cropShape="round"
                    showGrid={showGrid}
                    rotation={rotation}
                    style={{containerStyle: {width: '100%', height: '100%'}}}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                />
            </div>
            <Slider onChange={()=>{}} leading={SVGluminosity}/>
        </div>
     );
}

SmartImageProcessor.propTypes = {
    file: PropTypes.string,
    inputRef: PropTypes.object,
    showGrid: PropTypes.bool
}
 
export default SmartImageProcessor;