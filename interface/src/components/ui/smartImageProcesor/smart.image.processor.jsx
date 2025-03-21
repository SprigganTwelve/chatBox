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
    inputRef, showGrid= false,
    defaultOpacityValue, setModal = ()=>{},
    shape = "rect",
    ratio = 11/5,
    onApectRatioChange = ()=>{},
    idInBdd=0 
}) => {

    // const { setModal } = useContext(ChatBoxApiContext)

    const [ zoom, setZoom ] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [crop, setCrop] = useState({ x:0, y:0 })
    const [aspectRatio, setAspectratio] = useState({ratio: ratio, iteration: 1})
    const [croppedAreaPixels, setCroppedAreaPixels] = useState({ratio: ratio, iteration: 1})
    const [opacity, setOpacity] = useState(defaultOpacityValue ?? 1)

    const rationRange = [16/9, 4/3, 1, 21/9, 11/5]
    

    const onCropComplete = (cropArea, cropAreaPixels) => {
        setCroppedAreaPixels(cropAreaPixels)
    }

    const handleSaveImage = useCallback(async () =>{
        const formData = new FormData() 
        const croppedImage = await getCroppedImage(fileUrl, croppedAreaPixels)
        formData.append('id', idInBdd)
        formData.append("opacity", opacity)
        formData.append('file', croppedImage)
        await axios.post('http://localhost:3000/settings/general/image', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[idInBdd, opacity, fileUrl])



    useEffect(()=>{
        onApectRatioChange(aspectRatio.ratio)
    },[aspectRatio, onApectRatioChange])

    useEffect(() => {
        setModal((prev) => ({
            ...prev,
            onContinueHandler: () => handleSaveImage(croppedAreaPixels)
        }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [croppedAreaPixels, setModal]);
    

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
    ratio: PropTypes.number,
    shape: PropTypes.string,
    setModal: PropTypes.func,
    showGrid: PropTypes.bool,
    fileUrl: PropTypes.string,
    idInBdd: PropTypes.number,
    inputRef: PropTypes.object,
    onApectRatioChange: PropTypes.func,
    defaultOpacityValue: PropTypes.number,
}
 
export default SmartImageProcessor;