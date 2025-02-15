import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./chat.header.module.css"


const ChatHeader = ({ currentChatId }) => {
    const [user, setUser] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/${currentChatId}`);
                console.log(response.data);
                setUser(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
            }
        };

        if (currentChatId) { 
            fetchUser();
        }
    }, [currentChatId]); 

    return (
        <>
            { user.length > 0 ? (
                <div className={styles.header}>
                    <img src={user[0].image} alt="profil" />
                    <span className={styles.name}>{user[0].name}</span>
                    {/* TODO: Menu for parameter */}
                </div>
            ) : (
                <p style={{color: "white"}}>Chargement...</p> 
            )}
        </>
    );
};

export default ChatHeader;
