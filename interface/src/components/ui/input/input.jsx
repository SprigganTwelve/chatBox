import PropTypes from 'prop-types'
import {  useEffect, useRef, useState } from 'react';
import styles from './input.module.css';

const Input = ({ 
    name,
    type,
    title,
    placeholder,
    controller = ()=> {}
}) => {
    const inputRef = useRef(null);
    const [inputError, setInputError] = useState("")
    const [fileName, setFileName] = useState("");

    const onUploadingImage = async () => {
        inputRef.current.click();
    };

    const onFileChange = () => {
        const file = inputRef.current.files[0];
        if (file) {
            setFileName(file.name);
        }
    };



    useEffect(()=>{
        Input.executeController = controller(inputRef, setInputError);
    }, [controller])

    return ( 
        <div className={styles.inputContainer}>
            {title && <span className={styles.title}>{title}</span>}
            <input
                ref={inputRef}
                type={type || "text"}
                name={name ? name : title}
                className={type === "file" ? styles.inputFiles : styles.input}
                placeholder={inputError ? inputError  : placeholder || "placeholder"}
                onChange={type === "file" ? onFileChange : undefined}
                style={{ display: type === "file" ? "none" : "block" }}
            />
            {type === "file" && (
                <label className={styles.label} onClick={onUploadingImage}>
                    {fileName ? `Fichier : ${fileName}` : "Choisir un fichier"}
                </label>
            )}
           {type !== "file" && <div className={styles.underline} /> }
        </div>
    );
};

export default Input;

Input.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    title: PropTypes.string,
    controller: PropTypes.func,
    placeholder: PropTypes.string,
}
