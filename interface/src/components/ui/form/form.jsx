import React, { useRef } from "react";
import PropTypes from 'prop-types'
import axios from 'axios'
import styles from "./form.module.css";

const ChatBoxForm = ({
    title,
    url="",
    children,
    btnContent,
    formStyle = {},
    setBackendResponse,
    backendResponse = null,
}) => {
    
    const ComponentAtTheBottom = [];
    const formRef = useRef()

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const formData = new FormData();
            const formChildren = event.target;
            const formLength = formChildren.length - 1 - ComponentAtTheBottom.length;
    
            for (let i = 0; i <= formLength; i++) {
                if (formChildren[i].tagName === "INPUT") {
                    if (formChildren[i].type === "file") {
                        const file = formChildren[i].files[0];
                        if (file) {
                            formData.append(formChildren[i].name, file);
                        }
                    } else {
                        formData.append(formChildren[i].name, formChildren[i].value.trim());
                    }
                }
            }
    
            console.log("FormData content:");
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
    
            const response = await axios.post(url, formData);
            
            setBackendResponse(response)
            formRef.current.reset()

        } catch (err) {
            console.error("An error has happend while sending the form:", err);
        }
    };
    
    return (
        <div 
            className={styles.container}
            style={formStyle}
        >
            {title && <span>{title}</span>}
            <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
                {React.Children.map(children, (child) => {
                    
                    if (child.props.id === "next") {
                        ComponentAtTheBottom.push(child);
                        return null; 
                    }

                    return child;
                })}
                {backendResponse?.data.message ? (<span className={styles.errorMessage}>{backendResponse.data.message}</span>) : null}
                <button>
                    { btnContent }
                </button>
                {ComponentAtTheBottom.map((component) => component)}
            </form>
        </div>
    );
};

ChatBoxForm.propTypes = {
    url: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node,
    btnContent: PropTypes.string,
    formStyle: PropTypes.object,
    setBackendResponse: PropTypes.func,
    backendResponse: PropTypes.object,
}

export default ChatBoxForm;
