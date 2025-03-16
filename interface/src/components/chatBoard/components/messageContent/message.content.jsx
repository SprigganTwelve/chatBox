import axios from "axios";
import PropTypes from "prop-types"
import { useCallback, useEffect, useRef, useState } from "react";
import MessageBuddle from "/src/components/ui/messageBuddle/message.buddle";
import { insertFormattedDate } from "/src/utils/function";

import SVGsmile from "/src/assets/svg/smile-svgrepo-com.svg"
import styles from "./message.content.module.css";

const MessageContent = ({ talkSphereId, currentChatId, usersTemporaryChat, socket, setUsersTemporaryChat }) => {

    const container = useRef(null)
    const [ usersPreviousChat, setUsersPreviousChat ] = useState([])

    const getUserChat = useCallback(async () => {
        if (!talkSphereId) return; 
        try {
            if (talkSphereId) {
                let response = await axios.get(`http://localhost:3000/talkSphere/messages/${talkSphereId}`);
                setUsersPreviousChat(response.data);
            }
        } catch (error) {
            setUsersPreviousChat([]);
            console.error("Erreur lors de la récupération des messages:", error);
        }
    },[talkSphereId]);
    
    useEffect(()=>{
        if (container) {
            container.current.scrollTo({ top : container.current.scrollHeight, behaviour: "smooth"});
        }
    })

    useEffect(()=>{
        getUserChat();
    },[getUserChat])

    useEffect(() => {

        if (!socket.current) return;
    
        const handleNewMessage = (receivedMessage) => {
            console.log(receivedMessage);
            if (receivedMessage.talkSphereId === talkSphereId) {
                receivedMessage.createdAt = new Date(receivedMessage.createdAt);
    
                insertFormattedDate(receivedMessage);
        
                setUsersTemporaryChat((previous) => ({
                    id: receivedMessage.talkSphereId,
                    messages: [...(previous.messages || []), receivedMessage],
                }));
            }
        };


    
        socket.current.on("newMessage", handleNewMessage);
    
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            socket.current.off("newMessage", handleNewMessage);
        };
    }, [setUsersTemporaryChat, socket, talkSphereId]);
    

    useEffect(()=>{
        if (container) {
            container.current.scrollTo({top: container.current.scrollHeight, behaviour:'smooth'});
            console.log(usersTemporaryChat)
        }
    }, [usersTemporaryChat])

    return (
        <>
            <div ref={container} className={styles.container}>
                {usersPreviousChat.length > 0 && (
                    usersPreviousChat.map((message, index) => {
                        return (
                            <MessageBuddle
                                key={index}
                                content={message.content}
                                time={message.formattedHours}
                                isSent={message.senderId !== currentChatId}
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
                                    isSent={message.senderId !== currentChatId}
                            />
                            ))
                        )
                }
                {
                    usersPreviousChat.length == 0 && usersTemporaryChat.messages.length == 0 && (
                        <div className={styles.emptyChatContainer}>
                            <img src={SVGsmile} alt="" />
                            <span>Soyez le premier à envoyer un message  !!</span>
                        </div>
                    ) 
                }
            </div>
        </>
    );
};

MessageContent.propTypes = {
    socket: PropTypes.object,
    talkSphereId: PropTypes.number,
    currentChatId: PropTypes.number,
    usersTemporaryChat: PropTypes.shape({
        id: PropTypes.number,
        messages: PropTypes.array
    }),
    usersPreviousChat: PropTypes.array,
    setUsersPreviousChat: PropTypes.func,
    setUsersTemporaryChat: PropTypes.func,
    userChatDefaultSettings: PropTypes.object,
}

export default MessageContent;
