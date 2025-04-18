import axios from "axios";
import PropTypes from "prop-types"
import { useCallback, useEffect, useRef, useState, useContext } from "react";
import { ChatBoxApiContext } from "/src/context/context";
import MessageBuddle from "/src/components/ui/messageBuddle/message.buddle";
import { insertFormattedDate } from "/src/utils/function";

import SVGsmile from "/src/assets/svg/smile-svgrepo-com.svg"
import styles from "./message.content.module.css";

const MessageContent = ({ talkSphereId, talkSphereFolder  }) => {
    const container = useRef(null)
    const [ userChatFromBdd, setUserChatFromBdd ] = useState([])
    const [ joinRoomResponse, setJoinRoomResponse] = useState(false)
    const { socket, userId, setUsersTemporaryChat, usersTemporaryChat } = useContext(ChatBoxApiContext)


    const getUserChat = useCallback(async () => {
        if (!talkSphereId) return; 
        try {
            if (talkSphereId) {
                let response = await axios.get(`http://localhost:3000/talkSphere/messages/${talkSphereId}`);
                setUserChatFromBdd(response.data);
            }
        }
        catch (error) {
            setUserChatFromBdd(() => []);
            console.error("Erreur lors de la récupération des messages:", error);
        }
    },[talkSphereId]);
    

    useEffect(()=>{
        if (container) {
            container.current.scrollTo({ top : container.current.scrollHeight, behaviour: "smooth"});
        }
    })


    useEffect(() => {
        if (!socket?.current) return;

        getUserChat();
        socket.current.messagesSocketHandlers.offJoinRoomResponse()
        socket.current.messagesSocketHandlers.joinRoomRequest(talkSphereId)
        socket.current.messagesSocketHandlers.joinRoomResponse((state)=> setJoinRoomResponse(()=> state))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getUserChat, socket?.current]);
    

    const handleReceivingSocketMessage = useCallback((message)=>{
        console.log("receivedMessage :", message);
        if (message.talkSphereId === talkSphereId) {
            message.createdAt = new Date(message.createdAt);

            insertFormattedDate(message);
    
            setUsersTemporaryChat((previous) => ({
                id: message.talkSphereId,
                messages: [...(previous.messages || []), message ],
            }));
    } }, [setUsersTemporaryChat, talkSphereId])



    useEffect(()=>{
        if (!socket?.current) return;
        if(joinRoomResponse){
            socket.current.messagesSocketHandlers.offNewMessageResponses()
            socket.current.messagesSocketHandlers.newMessagesResponses(handleReceivingSocketMessage);
        }
        else{
            socket.current.messagesSocketHandlers.joinRoomRequest(talkSphereId)
        }
    }, [handleReceivingSocketMessage, joinRoomResponse, socket, talkSphereId])



    useEffect(()=>{
        if (container) {
            container.current.scrollTo({top: container.current.scrollHeight, behaviour:'smooth'});
        }
    }, [usersTemporaryChat])


    return (
        <>
            <div ref={container} className={styles.container}>
                { userChatFromBdd.length > 0 && (
                    userChatFromBdd.map((message, index) => {
                        return (
                            <MessageBuddle
                                key={index}
                                content={message.content}
                                media = { message.media }
                                time={message.formattedHours}
                                isSent={message.sender_id === userId}
                                talkSphereFolder = { talkSphereFolder }
                            />
                        );
                    }) 
                ) 
                }
                {
                        usersTemporaryChat.messages.length > 0 && (
                        usersTemporaryChat.messages.map((message,index)=>(
                            <MessageBuddle
                                    key={ index }
                                    media = { message.media }
                                    content={ message.content }
                                    time={ message.formattedHours }
                                    isSent={ message.senderId === userId }
                                    talkSphereFolder = { talkSphereFolder }
                            />
                            ))
                        )
                }
                {

                }
                {
                    userChatFromBdd.length == 0 && usersTemporaryChat.messages.length == 0 && (
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
    talkSphereFolder: PropTypes.string,
    userChatDefaultSettings: PropTypes.object,
}

export default MessageContent;
