import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types"
import styles from "./flex.edit.module.css"
import SVGedit from "/src/assets/svg/edit-2-svgrepo-com.svg"
import SVGclose from "/src/assets/svg/close-circle-svgrepo-com.svg"

const FlexEdit = ({ 
    title,
    defaultValue,
    description,
    callback = ()=>{},
    errorController = ()=>{ return null }
}) => {
    const inputRef = useRef(null)
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(defaultValue ?? "")

    const handleEditing = ()=>{
            setIsEditing(!isEditing)
            setTimeout(() => inputRef.current?.focus(), 0); 
    }

    useEffect(()=>{
        if(!isEditing ){
            const errorChecker = errorController(inputValue);
            if(!errorChecker){
                inputValue.trim() !=="" ? callback(inputValue)
                : callback("...")
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
                <input
                    type="text"
                    value={inputValue}
                    ref={inputRef}
                    className={styles.input}
                    disabled = {isEditing ? false : true}
                    onChange={(e)=>{
                        setInputValue(e.target.value)
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
    title: PropTypes.string,
    defaultValue: PropTypes.string,
    description: PropTypes.string,
    callback: PropTypes.func,
    errorController: PropTypes.func
}
 
export default FlexEdit;