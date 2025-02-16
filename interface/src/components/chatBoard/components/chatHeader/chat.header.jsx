
import { useEffect, useState, useContext } from "react";
import { ChatBoxApiContext } from "../../../../context/context"

import styles from "./chat.header.module.css"


    
const ChatHeader = ({ currentChatId }) => {

    const [receiver, setReceiver] = useState(null);
    const { friends } = useContext(ChatBoxApiContext);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = friends.find((item)=> item.id == currentChatId ) ;
                setReceiver(response);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
            }
        };

        if (currentChatId) { 
            fetchUser();
        }
    }, [currentChatId, friends]); 

    return (
        <>
            { receiver ? (
                <div className={styles.header}>
                    <img src={receiver.image != "" ? receiver.image : "/image/user/png-transparent-avatar-default-head-person-unknown-user-anonym-user-pictures-icon.png"} alt="profil" />
                    <span className={styles.name}>{receiver.name}</span>
                    {/* TODO: Menu for parameter */}
                </div>
            ) : (
                <p style={{color: "white"}}>Chargement...</p> 
            )}
        </>
    );
};

export default ChatHeader;
