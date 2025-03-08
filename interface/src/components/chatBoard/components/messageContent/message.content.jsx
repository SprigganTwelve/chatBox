import axios from "axios";
import PropTypes from "prop-types"
import { useEffect, useContext,useState, useRef } from "react";
import { ChatBoxApiContext } from "/src/context/context";
import MessageBuddle from "/src/components/ui/messageBuddle/message.buddle";
import { insertFormattedDate, insertFormattedDateFromArray } from "/src/utils/function";

import SVGsmile from "/src/assets/svg/smile-svgrepo-com.svg"
import styles from "./message.content.module.css";

const MessageContent = ({ talkSphereId }) => {

    const container = useRef(null)
    const [usersChat, setUsersChat] = useState([]);
    const { usersTemporaryChat, socket, setUsersTemporaryChat } = useContext(ChatBoxApiContext);

    const getUserChat = async () => {
        if (!talkSphereId) return; 
        try {
            let response = await axios.get(`http://localhost:3000/talkSphere/messages/${talkSphereId}`);
            const data = response.data;
            insertFormattedDateFromArray(data) 

            socket.current.on("newMessage", (receivedMessage) => {
                receivedMessage.createdAt = new Date(receivedMessage.createdAt); 
                
                socket.current.on("newMessage", (receivedMessage) => {
                    receivedMessage.createdAt = new Date(receivedMessage.createdAt);
                    
                    insertFormattedDate(receivedMessage);
                
                    setUsersTemporaryChat((previous) => ({
                        id: talkSphereId,
                        messages: [...previous.messages, receivedMessage]
                    }));
                });
            });

            console.log(usersTemporaryChat)

            setUsersChat(data);


    
        } catch (error) {
            console.error("Erreur lors de la récupération des messages:", error);
        }
    };
    
    useEffect(()=>{
        if (container) {
            container.current.scrollTo({ top : container.current.scrollHeight, behaviour: "smooth"});
            console.log("eee")
        }
    })

    useEffect(() => {
        getUserChat();
    }, [talkSphereId]);

    useEffect(()=>{
        if (container) {
            container.current.scrollTop = container.current.scrollHeight;
        }
    }, [usersTemporaryChat])

    return (

            <div ref={container} className={styles.container}>
                {usersChat.length > 0 && (
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
                ) 
                }
                {
                        usersTemporaryChat.messages.length > 0 && (
                        usersTemporaryChat.messages.map((message,index)=>(
                                <MessageBuddle
                                    key={index}
                                    content={message.content}
                                    time={message.formattedHours}
                                    sender={message.senderId}
                            />
                            ))
                        )
                }
                {
                    usersChat.length == 0 && usersTemporaryChat.messages.length == 0 && (
                        <div className={styles.emptyChatContainer}>
                            <img src={SVGsmile} alt="" />
                            <span>Soyez le premier à envoyer un message  !!</span>
                        </div>
                    ) 
                }
            </div>
    );
};

MessageContent.propTypes = {
    talkSphereId: PropTypes.number
}

export default MessageContent;
