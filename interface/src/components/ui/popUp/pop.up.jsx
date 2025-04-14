import { useContext, useEffect, useState } from "react";
import { ChatBoxApiContext } from "/src/context/context";
import MessageBuddle from "/src/components/ui/messageBuddle/message.buddle";
import styles from "./pop.up.module.css";

const PopUp = () => {
    const { popUp, setPopUp } = useContext(ChatBoxApiContext);
    const [verticalPosition, setVerticalPosition] = useState("-70px");

    useEffect(() => {
        if (popUp && popUp.message.trim() !== "") {
            setVerticalPosition("10px");

            const timeout = setTimeout(() => {
                setVerticalPosition("-70px"); 
            }, 5000);

            return () => {
                clearTimeout(timeout)
                setPopUp(null)
            };
        }
    }, [popUp, setPopUp]);

    return ( 
        <div 
            className={styles.container}
            style={{ bottom: verticalPosition }}
        >
            { popUp && popUp.message && popUp.message.trim() !== "" && 
                <MessageBuddle 
                    content={popUp.message}
                    backgroundColor={ popUp.type && typeof popUp.type === "string" && popUp.type.trim() === "sucess" ? "green" : "red" }
                />
            }
        </div>
    );
};

export default PopUp;
