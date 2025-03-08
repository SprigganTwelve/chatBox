import { useContext, useEffect, useState } from "react";
import { ChatBoxApiContext } from "/src/context/context";
import MessageBuddle from "/src/components/ui/messageBuddle/message.buddle";
import styles from "./error.box.module.css";

const ErrorBox = () => {
    const { error, setError } = useContext(ChatBoxApiContext);
    const [verticalPosition, setVerticalPosition] = useState("-70px");

    useEffect(() => {
        if (error && error.trim() !== "") {
            setVerticalPosition("10px");

            const timeout = setTimeout(() => {
                setVerticalPosition("-70px"); 
            }, 5000);

            return () => {
                clearTimeout(timeout)
                setError("")
            };
        }
    }, [error]);

    return ( 
        <div 
            className={styles.container}
            style={{ bottom: verticalPosition }}
        >
            { error && error.trim() !== "" &&  <MessageBuddle 
                content={error}
                backgroundColor="red"
            />}
        </div>
    );
};

export default ErrorBox;
