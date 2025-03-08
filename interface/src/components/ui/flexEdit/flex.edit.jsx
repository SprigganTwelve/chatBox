import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types"
import styles from "./flex.edit.module.css"
import SVGedit from "/src/assets/svg/edit-2-svgrepo-com.svg"
import SVGclose from "/src/assets/svg/close-circle-svgrepo-com.svg"

const FlexEdit = ({ 
    row,
    title,
    resize = "horizontal",
    defaultValue,
    description,
    callback = ()=>{},
    errorController = ()=>{ return null }
}) => {
    const textareaRef = useRef(null)
    const [isEditing, setIsEditing] = useState(false);
    const [textareaValue, settextareaValue] = useState(defaultValue ?? "")

    const handleEditing = ()=>{
            setIsEditing(!isEditing)
            setTimeout(() => textareaRef.current?.focus(), 0); 
    }

    useEffect(()=>{
        if(!isEditing ){
            const errorChecker = errorController(textareaValue);
            if(!errorChecker){
                textareaValue.trim() !=="" ? callback(textareaValue)
                : callback("...")
            }else{
                settextareaValue(defaultValue)
            }
        }
    },[isEditing, callback])

    return ( 
        <div 
            className={styles.container}
            onDoubleClick={handleEditing}
        >
            {title && <span className={styles.title}>{title}</span>}
            {description && <span className={styles.description}>{description}</span>}
            <div>
                <textarea
                    type="text"
                    rows={row ?? "2"}
                    value={textareaValue}
                    ref={textareaRef}
                    className={styles.textarea}
                    style={{ resize: +resize ?  "none" : resize}}
                    disabled = {isEditing ? false : true}
                    onChange={(e)=>{
                        settextareaValue(e.target.value)
                    }}
                    onKeyDown={(e)=>{
                        if (e.key === "Enter") {
                            setIsEditing(false)
                        }
                    }}
                />
                <img 
                    src={isEditing ? SVGclose : SVGedit}
                    className={styles.icon}
                    alt="Edit icon"
                    onClick={handleEditing}
                />
            </div>
        </div>
     );
}

FlexEdit.propTypes = {
    row: PropTypes.string,
    title: PropTypes.string,
    resize: PropTypes.string,
    defaultValue: PropTypes.string,
    description: PropTypes.string,
    callback: PropTypes.func,
    errorController: PropTypes.func
}
 
export default FlexEdit;