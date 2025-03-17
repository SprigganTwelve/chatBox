import {  useEffect, useState } from "react";
import PropTypes from 'prop-types'
import Cropper from 'react-easy-crop'

import styles from "./smart.image.processor.module.css"

import Slider from "/src/components/ui/slider/silider";
import MenuItem from "./components/menu.item";

import { getCroppedImage } from '/src/utils/function'

import SVGrotation from '/src/assets/svg/rotation-reset-svgrepo-com.svg'
import SVGfilter from '/src/assets/svg/filter-options-preferences-settings-svgrepo-com.svg'
import SVGblur from '/src/assets/svg/blur-svgrepo-com.svg'
import SVGannotation from '/src/assets/svg/pencil-svgrepo-com.svg'
import SVGimport from '/src/assets/svg/import-svgrepo-com.svg'
import SVGluminosity from '/src/assets/svg/luminosity-svgrepo-com.svg'
import SVGratio from '/src/assets/svg/aspect-ratio-svgrepo-com (1).svg'
import axios from "axios";

const SmartImageProcessor = ({ fileUrl, inputRef, showGrid= false, defaultOpacityValue, setModal }) => {

    // const { setModal } = useContext(ChatBoxApiContext)

    const [ zoom, setZoom ] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [crop, setCrop] = useState({ x:0, y:0 })
    const [coppedAreaPixels, setCroppedPixels] = useState(0)
    const [opacity, setOpacity] = useState(defaultOpacityValue ?? 1)
    

    const onCropComplete = (cropArea, cropAreaPixels) => {
            setCroppedPixels(cropAreaPixels)
    }

    const handleSaveImage = async () =>{
        const croppedImage = await getCroppedImage(fileUrl, coppedAreaPixels)
        await axios.post('',{croppedImage})
    }

    useEffect(()=>{
        setModal((prev) => ({...prev, onContinueHandler: () => handleSaveImage() }))
    },[setModal])

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
            <div  
                className={styles.cropContainer}
                style={{ opacity: opacity }}
            >
                <Cropper
                    image={fileUrl}
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
            <Slider 
                leading={SVGluminosity}
                containerStyles = {{ paddingTop: 10 }}
                onChange={(opacity)=>{
                    console.log(opacity)
                    setOpacity(opacity)
                }}
            />
        </div>
     );
}

SmartImageProcessor.propTypes = {
    fileUrl: PropTypes.string,
    setModal: PropTypes.func,
    showGrid: PropTypes.bool,
    inputRef: PropTypes.object,
    defaultOpacityValue: PropTypes.number
}
 
export default SmartImageProcessor;