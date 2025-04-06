
import axios from "axios";
import PropTypes from "prop-types";
import {  useRef, useEffect, useState } from "react";

import VibeBox from "./components/vibeBox/vibe.box";
import Switch from "/src/components/ui/switch/switch"
import styles from "./interface.settings.module.css"
import ViewOption from "/src/components/ui/viewOption/view.option";
import SmartImageProcessor from "/src/components/ui/smartImageProcesor/smart.image.processor";

import SVGadd from '/src/assets/svg/add-circle-svgrepo-com.svg'
import SVGfontsize from '/src/assets/svg/font-size-svgrepo-com (1).svg'
import SVGlanguage from '/src/assets/svg/language-svgrepo-com.svg'
import SGVnativedefaultbackground from '/src/assets/svg/image-1-svgrepo-com.svg'
import SVGthemes from '/src/assets/svg/vivo-themes-svgrepo-com.svg'

const InterfaceSettings = ({ defaultSettings, setModal }) => {

    const inputFileRef = useRef(null)
    const [isFocus, setFocus] = useState(0)
    const [isActive, setIsActive] = useState(defaultSettings.fontsize)
    const [imageUploaded, setImageUploaded]= useState("")

    const fontSize = {
        fontSize1: 15,
        fontSize2: 18,
        fontSize3: 24
    }


    //Herer we handle the changement of the image global settings wich is a blob property

    const handleChangeGlobalImageSettings = async() => {
        try{
            if (inputFileRef.current) {
                const formData = new FormData().append("file", inputFileRef.current.files[0])
                const response = await axios.post("http://localhost:3000/settings/general/image", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if (response.status !== 200){
                    console.log("Something went wrong when changing the image setting property, response : ", response)
                    return ;
                }
            }
        }
        catch(error){
            console.log("Something went wrong when changing the image setting property, error : ", error)
        }
    }

    //Here we change the basics global settings such as one wich is not a binary or blob object

    const handleChangeBasicsSettings = async ({key, value, id}) => {
        try{
            const response = await axios.post('http://localhost:3000/settings/general/basics', {key, value, id})
            if(response.status !== 200) {
                console.log("Something went wrong when changing the setting, response : ", response)
                return ;
            };
        }
        catch(error){
            console.log("Something went wrong when changing the setting, error : ", error)
        }
    }

    const themes = [
        "cat.jpg",
        "message_letters.jpg",
        "galaxy_purple.jpg",
        "orange_galaxy.jpg",
        // "message_bubble.jpg",
    ]

    
    useEffect(()=>{
        if (defaultSettings && !imageUploaded) {
            const imageLoader = new Image()

            imageLoader.src = `http://localhost:3000/uploads/themes/customizes/${defaultSettings.theme}`
           
            imageLoader.onload = ()=>{ 
                setImageUploaded(imageLoader.src)
                setFocus(themes.length)
            }

            imageLoader.onerror = ()=>{
                    console.log("Something went wrong while uploading an uploaded image by user")
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[defaultSettings, imageUploaded])


    return ( 
        <div className={styles.container}>
            <div className={styles.themes}>
                {themes.map((item, key)=> {

                   return (
                        <VibeBox
                            key={key}
                            imagePath={ item.includes("http") ? imageUploaded : "http://localhost:3000/uploads/themes/" + item }
                            isFocus={isFocus === key}
                            onClick={()=> {
                                setFocus(key)
                            }}
                        />
                    )
                })}
                {
                    imageUploaded && 
                    <VibeBox 
                        imagePath={imageUploaded}
                        isFocus= {isFocus ===themes.length}
                        onClick={()=> setFocus(themes.length)}
                    />
                }
                <div className={styles.iconImageContainer}>
                    <img src={SGVnativedefaultbackground} className={styles.icon} alt="image" />
                </div>
            </div>
            <input
                hidden
                type="file"
                ref={inputFileRef}
                onChange={() => {
                    if(inputFileRef.current.files[0]){
                        
                        setModal(()=>{
                            return({
                                open: true,
                                showCancelAndConfirmButtons: true,
                                styleContent: { backgroundColor: 'transparent' },
                                onContinueHandler: () => SmartImageProcessor.handleSaveImage(),
                                ModalComponent: ()=>( <div 
                                    className={styles.imageManagerSection}
                                >
                                    <SmartImageProcessor
                                        showGrid={true}
                                        setModal={setModal}
                                        inputRef={inputFileRef}
                                        idInBdd={defaultSettings.settings_id}
                                        fileUrl={URL.createObjectURL(inputFileRef.current.files[0])}
                                        callback = {() => handleChangeGlobalImageSettings()}
                                    />
                                </div> )
                            })
                        })
                    }
                }}
            />
            <ViewOption
                title="Add a global chat background"
                leading={SVGadd}
                onClick={()=>{
                    inputFileRef.current.click()
                }}
            />
            <ViewOption
                title="Font size"
                leading={SVGfontsize}
            >
                <div className={styles.fontSizeLetterSection}>
                    <div 
                        style={{ fontSize: fontSize.fontSize1}}
                        className={ isActive === 15 ? styles.isActive : ""}
                        onClick={()=> {
                            setIsActive(fontSize.fontSize1)
                            handleChangeBasicsSettings({ key: "fontSize", value: fontSize.fontSize1, id: defaultSettings.settings_id })
                        }}
                    >
                        A
                    </div>
                    <div 
                        style={{ fontSize: fontSize.fontSize2}}
                        className={ isActive ===18 ? styles.isActive : ""}
                        onClick={()=> {
                            setIsActive(fontSize.fontSize2)
                            handleChangeBasicsSettings({ key: "fontSize", value: fontSize.fontSize2, id:  defaultSettings.settings_id })
                        }}
                    >
                        A
                    </div>
                    <div 
                        style={{ fontSize: fontSize.fontSize3}}
                        className={isActive == 24 ? styles.isActive : ""}
                        onClick={()=>{
                            setIsActive(fontSize.fontSize3)
                            handleChangeBasicsSettings({ key: "fontSize", value: fontSize.fontSize3, id:  defaultSettings.settings_id })
                        }}
                    >
                        A
                    </div>
                </div>
            </ViewOption>

            <ViewOption
                title="Language"
                leading={SVGlanguage}
                onClick={()=>{
                     //TODO: IMPLEMENT
                }}
            />

            <ViewOption
                title="Themes"
                leading={SVGthemes}
                onClick={()=>{
                    // handleChangeBasicsSettings({ key:, value: , id: defaultSettings.id })
                }}
            >
                <Switch />
            </ViewOption>
        </div>
     );
}

InterfaceSettings.propTypes = {
    defaultSettings: PropTypes.shape({
        theme: PropTypes.string,
        fontsize: PropTypes.number,
        settings_id: PropTypes.number,
    }),
    modal: PropTypes.bool,
    setModal: PropTypes.func,
}
 
export default InterfaceSettings;