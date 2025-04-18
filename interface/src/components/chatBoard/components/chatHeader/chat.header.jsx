
import PropTypes from "prop-types"
import { useEffect, useState, useContext } from "react";
import { ChatBoxApiContext } from "../../../../context/context"

import styles from "./chat.header.module.css"


    
const ChatHeader = ({  fullBackgroundOpacity }) => {

    const [receiver, setReceiver] = useState(null);
    const { allChats, talkSphereId } = useContext(ChatBoxApiContext);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = allChats.find((item)=> item.id == talkSphereId ) ;
                const imageData = JSON.parse(response.image_data)
                setReceiver(()=>({ ...response, image_data: imageData }));
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
            }
        };

        if (talkSphereId) { 
            fetchUser();
        }
    }, [allChats,  talkSphereId]); 

    return (
        <>
            { receiver ? (
                <div 
                    className={styles.header}
                    style={{
                        "--opacityBackground" : fullBackgroundOpacity
                    }}
                >
                    <img 
                        src={ receiver.image != "" ?
                            `http://localhost:3000/uploads/users/${receiver.image_data.folder}/parameters/${receiver.image_data.image}` 
                            : "/image/user/png-transparent-avatar-default-head-person-unknown-user-anonym-user-pictures-icon.png"
                        }
                        alt="profil"
                    />
                    <span className={styles.name}>{receiver.name}</span>
                </div>
            ) : (
                <div style={{color: "white"}} /> 
            )}
        </>
    );
};

ChatHeader.propTypes = {
    currentChatId: PropTypes.number,
    fullBackgroundOpacity: PropTypes.number,
}

export default ChatHeader;
