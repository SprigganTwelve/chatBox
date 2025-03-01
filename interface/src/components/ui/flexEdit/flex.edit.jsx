import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types"
import styles from "./flex.edit.module.css"
import SVGedit from "/src/assets/svg/edit-2-svgrepo-com.svg"
import SVGclose from "/src/assets/svg/close-circle-svgrepo-com.svg"

const FlexEdit = ({ title, value, callback = ()=>{}}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value ?? "")
    const inputRef = useRef(null)

    useEffect(()=>{
        if(isEditing){
            callback(inputValue, setInputValue)
        }
    },[isEditing, callback])

    return ( 
        <div className={styles.container}>
            <span className={styles.title}>{title}</span>
            <div>
                <input
                    type="text"
                    value={inputValue}
                    ref={inputRef}
                    className={styles.input}
                    disabled = {isEditing ? false : true}
                    onChange={(e) => setInputValue(e.target.value)}
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
                    onClick={() => {
                        setIsEditing(!isEditing)
                        setTimeout(() => inputRef.current?.focus(), 0); 
                    }}
                />
            </div>
        </div>
     );
}

FlexEdit.propTypes = {
    title: PropTypes.string,
    value: PropTypes.string,
    callback: PropTypes.func
}
 
export default FlexEdit;