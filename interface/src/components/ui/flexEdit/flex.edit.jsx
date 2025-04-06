import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types"
import styles from "./flex.edit.module.css"
import SVGedit from "/src/assets/svg/edit-2-svgrepo-com.svg"
import SVGclose from "/src/assets/svg/close-circle-svgrepo-com.svg"

const FlexEdit = ({ 
    row,
    title,
    placeholder,
    textareaStyle ={ resize: "horizontal"},
    containerStyle = {},
    defaultValue = "",
    callback = ()=>{},
    errorController = ()=>{ return null }
}) => {
    const textareaRef = useRef(null)
    const initialTextValueRef = useRef(defaultValue ?? "");
    const [isEditing, setIsEditing] = useState(false);
    const [textareaValue, setTextareaValue] = useState(defaultValue??"")

    const handleEditing = ()=>{
            setIsEditing(!isEditing)
            setTimeout(() => {
                if (textareaRef.current && initialTextValueRef.current) {
                    textareaRef.current.focus()
                    const length = textareaValue.length;
                    textareaRef.current.setSelectionRange(length, length)
                    initialTextValueRef.current = textareaValue
                }
            }, 0);
    }

    useEffect(()=>{
        if(!isEditing && textareaValue != defaultValue){
            const errorChecker = errorController(textareaValue);
            if(!errorChecker){
                 if (textareaValue == "") {
                    callback(null)
                 }
                 else{
                     callback(textareaValue)
                 }
            }
            else{
                setTextareaValue(initialTextValueRef.current)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isEditing, callback])

    return ( 
        <div 
            className={styles.container}
            style={containerStyle}
            onDoubleClick={handleEditing}
        >
            {title && <span className={styles.title}>{title}</span>}
            <div>
                <textarea
                    type="text"
                    placeholder={placeholder}
                    rows={row ?? "2"}
                    value={textareaValue}
                    ref={textareaRef}
                    className={styles.textarea}
                    style={textareaStyle}
                    disabled = {isEditing ? false : true}
                    onChange={(e)=>{
                        setTextareaValue(()=> e.target.value)
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
    placeholder: PropTypes.string,
    textareaStyle: PropTypes.object,
    defaultValue: PropTypes.string,
    containerStyle: PropTypes.object,
    callback: PropTypes.func,
    errorController: PropTypes.func
}
 
export default FlexEdit;