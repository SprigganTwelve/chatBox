import axios from "axios";
import { useEffect, useState } from "react";
import MessageBuddle from "./messageBuddle/message.buddle";

import SVGsmile from "/src/assets/svg/smile-svgrepo-com.svg"
import styles from "./message.content.module.css";

const MessageContent = ({ talkSphereId }) => {
    const [usersChat, setUsersChat] = useState([]);

    const getUserChat = async () => {
        if (!talkSphereId) return; 
        try {
            let response = await axios.get(`http://localhost:3000/talkSphere/messages/${talkSphereId}`);
            const data = response.data;
            for (const message of data) {
                const dateObj = new Date(message.createdAt);
                if (isNaN(dateObj.getTime())) {
                    console.warn(`Date invalide: ${message.createdAt}`);
                    continue; 
                }
    
                const formattedDate = new Intl.DateTimeFormat("fr-FR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false
                }).format(dateObj);

                const formattedHours = new Intl.DateTimeFormat("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                }).format(dateObj);
                
                message.date = dateObj;
                message.formattedDate = formattedDate;
                message.formattedHours = formattedHours;

            }
    
            data.sort((a, b)=> a.date.getTime() - b.date.getTime() )
            console.log(data);
            setUsersChat(data); 
    
        } catch (error) {
            console.error("Erreur lors de la récupération des messages:", error);
        }
    };
    

    useEffect(() => {
        getUserChat();
    }, [talkSphereId]);
    return (

            <div className={styles.container}>
                {usersChat.length > 0 ? (
                    usersChat.map((message, index) => {
                        return (
                            <MessageBuddle
                                key={index}
                                content={message.content}
                                time={message.formattedHours}
                                sender={message.senderId}
                            />
                        );
                    }) 
                ) : (
                    <div className={styles.emptyChatContainer}>
                        <img src={SVGsmile} alt="" />
                        <span>Soyez le premier à envoyer un message  !!</span>
                    </div>
                )
                }
                    <MessageBuddle
                                content={"Tu fais quoi actu ?"}
                                time={"12:20"}
                                sender={1}
                    />
                    <MessageBuddle
                                content={"Bof rien de special et toi"}
                                time={"12:21"}
                                sender={0}
                    />
                    <MessageBuddle
                                content={"Ok got it"}
                                time={"12:21"}
                                sender={1}
                    />
                    <MessageBuddle
                                content={"Et toi"}
                                time={"12:22"}
                                sender={0}
                    />
                    <MessageBuddle
                                content={"Je regarde la télé avec mes p'tits frères"}
                                time={"12:23"}
                                sender={1}
                    />
                    <MessageBuddle
                                content={"Dis ça te dit qu'on se rencontre demain ou après demain ? j'ai quelque chose d'important à te raconter"}
                                time={"12:23"}
                                sender={1}
                    />
                    <MessageBuddle
                                content={"Demain je ne suis pas sur mais un autre jour c'est possible"}
                                time={"12:23"}
                                sender={0}
                    />
                    <MessageBuddle
                                content={"Ok on se voit là"}
                                time={"12:23"}
                                sender={1}
                    />
            </div>
    );
};

export default MessageContent;
