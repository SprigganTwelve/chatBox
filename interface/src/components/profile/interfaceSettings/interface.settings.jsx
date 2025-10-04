
import axios from "axios";
import PropTypes from "prop-types";
import {  useRef, useEffect, useState } from "react";

import VibeBox from "./components/vibeBox/vibe.box";
import Switch from "/src/components/ui/switch/switch"
import ViewOption from "/src/components/ui/viewOption/view.option";
import SmartImageProcessor from "/src/components/ui/smartImageProcesor/smart.image.processor";

import SVGadd from '/src/assets/svg/add-circle-svgrepo-com.svg'
import SVGfontsize from '/src/assets/svg/font-size-svgrepo-com (1).svg'
import SVGlanguage from '/src/assets/svg/language-svgrepo-com.svg'
import SGVnativedefaultbackground from '/src/assets/svg/image-1-svgrepo-com.svg'
import SVGthemes from '/src/assets/svg/vivo-themes-svgrepo-com.svg'
import SVGmode from '/src/assets/svg/quit-full-screen-svgrepo-com.svg'

import styles from "./interface.settings.module.css"
import Modal from "/src/components/ui/modal/modal";



const InterfaceSettings = ({ defaultSettings, userFolder, baseApiURL }) => {

    const inputFileRef = useRef(null)

    const [isFocus, setFocus] = useState(0)
    const [croppedFile, setCroppedFile]= useState("")
    const [isActive, setIsActive] = useState(defaultSettings.fontsize)

    const [ selectedFile, setSelectedFile  ] = useState(false)

    const fontSize = {
        fontSize1: 15,
        fontSize2: 18,
        fontSize3: 24
    }


    //Here we change the basics global settings such as one wich is not a binary or blob object

    const handleChangeBasicsSettings = async ({key, value, id}) => {
        try{
            const response = await axios.patch(`${baseApiURL.current}/settings/general/basics`, {key, value, id})
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
        if (defaultSettings && userFolder && !croppedFile) {
            const imageLoader = new Image()

            imageLoader.src = `${baseApiURL.current}/uploads/users/${userFolder}/parameters/${defaultSettings.theme}`
           
            imageLoader.onload = ()=>{ 
                setCroppedFile(imageLoader.src)
                setFocus(themes.length - 1 )
            }

            imageLoader.onerror = ()=>{
                    console.log("Something went wrong while uploading an uploaded image by user")
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[defaultSettings, croppedFile])


    return ( 
        <div className={styles.container}>
            <div className={styles.themes}>
                {themes.map((item, key)=> {

                   return (
                        <VibeBox
                            key={key}
                            imageUrl={`${baseApiURL.current}/uploads/themes/` + item }
                            isFocus={isFocus === key}
                            onClick={()=> {
                                setFocus(key)
                            }}
                        />
                    )
                })}
                {
                    croppedFile && 
                    <VibeBox 
                    imageUrl={ 
                            croppedFile instanceof File ? URL.createObjectURL(croppedFile)
                            : croppedFile
                        }
                        isFocus= {isFocus === themes.length}
                        onClick={()=> setFocus(themes.length)}
                        opacity= { defaultSettings && defaultSettings.opacity }
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
                        setSelectedFile(inputFileRef.current.files[0])
                    }
                }}
            />
            <Modal
                open={!!selectedFile}
                showCancelAndConfirmButtons={true}
                styleContent = {{ backgroundColor: 'transparent' }}
                onClose = {()=>{ 
                    setSelectedFile(null)
                    inputFileRef.current.value = null
                }}
                onContinueHandler={ () =>{ 
                    SmartImageProcessor.handleSaveCroppedImage()
                }}
            >
                <div 
                    className={styles.imageManagerSection}
                >
                    <SmartImageProcessor
                        showGrid={true}
                        inputRef={inputFileRef}
                        enableChangeOpacity = {true}
                        folder = { userFolder }
                        idInBdd={ defaultSettings.settings_id }
                        setCroppedFile = {setCroppedFile}
                        url= {`${baseApiURL.current}/settings/general/image`}
                        fileUrl={ selectedFile &&  URL.createObjectURL(selectedFile)}
                    />
                </div> 
            </Modal>
            <ViewOption
                title="Add a global chat background"
                leading={SVGadd}
                onClick={()=>{
                    inputFileRef.current.click()
                }}
            />
            <ViewOption
                title="Background Full View mode"
                leading={SVGmode}
            >
                <Switch
                    defaultValue={defaultSettings.full}
                    callback={(state)=> handleChangeBasicsSettings({ 
                        id: defaultSettings.settings_id, 
                        key: "full" ,
                        value: +state
                    })}
                />
            </ViewOption>
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
                title="Global Colors"
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
        full: PropTypes.number,
        theme: PropTypes.string,
        opacity: PropTypes.number,
        fontsize: PropTypes.number,
        settings_id: PropTypes.number,
    }),
    userFolder: PropTypes.string
}
 
export default InterfaceSettings;