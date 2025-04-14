import axios from "axios";
import {   useCallback, useEffect, useState } from "react";
import PropTypes from 'prop-types'
import Cropper from 'react-easy-crop'

import styles from "./smart.image.processor.module.css"

import MenuItem from "./components/menu.item";
import Slider from "/src/components/ui/slider/silider";

import { getCroppedImage } from '/src/utils/function'

import SVGrotation from '/src/assets/svg/rotation-reset-svgrepo-com.svg'
import SVGfilter from '/src/assets/svg/filter-options-preferences-settings-svgrepo-com.svg'
import SVGblur from '/src/assets/svg/blur-svgrepo-com.svg'
import SVGannotation from '/src/assets/svg/pencil-svgrepo-com.svg'
import SVGimport from '/src/assets/svg/import-svgrepo-com.svg'
import SVGluminosity from '/src/assets/svg/luminosity-svgrepo-com.svg'
import SVGratio from '/src/assets/svg/aspect-ratio-svgrepo-com (1).svg'

const SmartImageProcessor = ({ 
    fileUrl, 
    url = "",
    inputRef,
    idInBdd=0, 
    ratio = 11/5,
    shape = "rect",
    showGrid= false,
    defaultOpacityValue,
    enableChangeOpacity= false,
    setCroppedFile = () => {},
    onApectRatioChange = ()=>{},
}) => {

    // const { setModal } = useContext(ChatBoxApiContext)

    const [ zoom, setZoom ] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [crop, setCrop] = useState({ x:0, y:0 })
    const [croppedAreaPixels, setCroppedAreaPixels] = useState({})
    const [opacity, setOpacity] = useState(defaultOpacityValue ?? 1)
    const [aspectRatio, setAspectratio] = useState({ratio: ratio, iteration: 1})

    const rationRange = [16/9, 4/3, 21/9, 1, 11/5]
    

    const onCropComplete = (cropArea, cropAreaPixels) => {
        setCroppedAreaPixels(cropAreaPixels)
    }

    SmartImageProcessor.handleSaveCroppedImage =  useCallback(async () =>{  //GB, This function is  provided by the component and should be used to save the cropped image
        try{
            if(!url){
                console.log("You must pass an url prop to SmartImageProcessor to properly executed the handleSaveCroppedImage function")
                return;
            }
            const formData = new FormData() 
            const croppedImage = await getCroppedImage(fileUrl, croppedAreaPixels)
            formData.append('id', idInBdd)
            formData.append("opacity", opacity)
            formData.append('file', croppedImage)
            await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            setCroppedFile(()=> URL.createObjectURL(croppedImage))
        }catch(error){
            console.log("Something went wrong while sending the cropped image: ", error)
        }
    },[url, fileUrl, croppedAreaPixels, idInBdd, opacity, setCroppedFile])


    useEffect(()=>{
        onApectRatioChange(aspectRatio.ratio)
    },[aspectRatio, onApectRatioChange])



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
                            setAspectratio((prev) => {
                                const newIteration = (prev.iteration + 1) % rationRange.length;
                                return { ...prev, iteration: newIteration, ratio: rationRange[newIteration] };
                            })
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
                    aspect={aspectRatio.ratio}
                    zoom={zoom}
                    cropShape={shape}
                    showGrid={showGrid}
                    rotation={rotation}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    style={{containerStyle: {width: '100%', height: '100%'}}}
                />
            </div>
            {
                enableChangeOpacity && (
                    <Slider 
                        leading={SVGluminosity}
                        containerStyles = {{ paddingTop: 10 }}
                        onChange={(opacity)=>{
                            console.log(opacity)
                            setOpacity(opacity)
                        }}
                    />
                )
            } 
            
        </div>
     );
}

SmartImageProcessor.propTypes = {
    url: PropTypes.string,
    ratio: PropTypes.number,
    shape: PropTypes.string,
    showGrid: PropTypes.bool,
    fileUrl: PropTypes.string,
    idInBdd: PropTypes.number,
    inputRef: PropTypes.object,
    setCroppedFile: PropTypes.func,
    onApectRatioChange: PropTypes.func,
    enableChangeOpacity : PropTypes.bool,
    defaultOpacityValue: PropTypes.number,
}
 
export default SmartImageProcessor;