
import { useRef, useState } from "react";
import ViewOption from "/src/components/ui/viewOption/view.option";
import VibeBox from "./components/vibeBox/vibe.box";
import Switch from "/src/components/ui/switch/switch"
import styles from "./interface.settings.module.css"

import SVGadd from '/src/assets/svg/add-circle-svgrepo-com.svg'
import SVGfontsize from '/src/assets/svg/font-size-svgrepo-com (1).svg'
import SVGlanguage from '/src/assets/svg/language-svgrepo-com.svg'
import SVGthemes from '/src/assets/svg/vivo-themes-svgrepo-com.svg'

const InterfaceSettings = () => {

    const inputFileRef = useRef(null)
    const [isFocus, setFocus] = useState(0)
    const themes = [
        "cat.jpg",
        "message_letters.jpg",
        "galaxy_purple.jpg",
        "orange_galaxy.jpg",
        "message_bubble.jpg"
    ]

    return ( 
        <div className={styles.container}>
            <div className={styles.themes}>
                {themes.map((item, key)=>(
                    <VibeBox
                        key={key}
                        imagePath={`http://localhost:3000/uploads/themes/${item}`}
                        isFocus={isFocus === key}
                        onClick={()=> {
                            setFocus(key)
                        }}
                    />
                ))}
            </div>
            <input
                hidden
                ref={inputFileRef}
                type="file"
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
                onClick={()=>{
                     //TODO: IMPLEMENT
                }}
            />

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
                    //TODO: IMPLEMENT
                }}
            >
                <Switch />
            </ViewOption>
        </div>
     );
}
 
export default InterfaceSettings;