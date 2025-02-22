import {  useEffect, useRef, useState } from 'react';
import styles from './input.module.css';

const Input = ({ name, title, placeholder, type, controller = ()=> {} }) => {
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

    const manageControllerParameter = controller(inputRef, setInputError)


    useEffect(()=>{
        Input.executeController = manageControllerParameter;
    }, [])

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
