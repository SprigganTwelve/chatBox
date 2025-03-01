import { useContext } from "react";
import styles from "./error.box.module.css"
import { ChatBoxApiContext } from "/src/context/context";
import MessageBuddle from "../../chatBoard/components/messageContent/messageBuddle/message.buddle";

const ErrorBox = () => {
    const { error } = useContext( ChatBoxApiContext )

    return ( 
        <div className={styles.container}>
                <MessageBuddle content={"Something wrong heppens"}/>
        </div>
     );
}
 
export default ErrorBox;