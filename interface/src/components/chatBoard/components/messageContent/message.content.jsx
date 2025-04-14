import axios from "axios";
import PropTypes from "prop-types"
import { useCallback, useEffect, useRef, useState, useContext } from "react";
import { ChatBoxApiContext } from "/src/context/context";
import MessageBuddle from "/src/components/ui/messageBuddle/message.buddle";
import { insertFormattedDate } from "/src/utils/function";

import SVGsmile from "/src/assets/svg/smile-svgrepo-com.svg"
import styles from "./message.content.module.css";

const MessageContent = ({ talkSphereId, currentChatId  }) => {
    const { socket, setUsersTemporaryChat, usersTemporaryChat } = useContext(ChatBoxApiContext)
    const container = useRef(null)
    const [ usersPreviousChat, setUsersPreviousChat ] = useState([])

    const getUserChat = useCallback(async () => {
        if (!talkSphereId) return; 
        try {
            if (talkSphereId) {
                let response = await axios.get(`http://localhost:3000/talkSphere/messages/${talkSphereId}`);
                console.log(response)
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


    const handleReceivingSocketMessage = useCallback((message)=>{
        console.log("receivedMessage :", message);
        if (message.talkSphereId === talkSphereId) {
            message.createdAt = new Date(message.createdAt);

            insertFormattedDate(message);
    
            setUsersTemporaryChat((previous) => ({
                id: message.talkSphereId,
                messages: [...(previous.messages || []), message],
            }));
        } }, [setUsersTemporaryChat, talkSphereId])


        useEffect(() => {
            if (!socket?.current) return;
        
            const socketInstance = socket.current;
            socketInstance.off("newMessage");
            socketInstance.on("newMessage", handleReceivingSocketMessage);
        
            return () => {
                socketInstance.off("newMessage", handleReceivingSocketMessage); // cleanup
            };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [socket?.current, handleReceivingSocketMessage]);
    


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
                                isSent={message.sender_id !== currentChatId}
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
                                    time={ message.formattedHours }
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
    userChatDefaultSettings: PropTypes.object,
}

export default MessageContent;
