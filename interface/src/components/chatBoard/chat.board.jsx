import PropTypes from 'prop-types'
import {  useContext, useEffect } from "react";
import { ChatBoxApiContext } from "../../context/context";

import ChatHeader from "./components/chatHeader/chat.header";
import MessageContent from "./components/messageContent/message.content";
import MessageSender from "./components/messageSender/message.sender";
import MessageSVG from "/src/assets/svg/chat-round-line-svgrepo-com.svg";

import styles from './chat.board.module.css';




const ChatBoard = ({ uploadedBackground }) => {

    const { allChats, 
            baseApiURL,
            currentChat,
            talkSphereId,
            setCurrentChat,
            userChatDefaultSettings,
            fullBackgroundOpacity,
        } = useContext(ChatBoxApiContext)

    useEffect(()=>{
        if(allChats && talkSphereId && allChats.length > 0){
            const index = allChats.findIndex((item)=> item.id == talkSphereId)

            if(index != -1) {
                allChats[index].image_data = typeof allChats[index].image_data === "string"
                    ? JSON.parse(allChats[index].image_data)
                    : allChats[index].image_data;

                console.log(allChats[index])
                setCurrentChat(()=> allChats[index])

            }
        }
    },[allChats, setCurrentChat, talkSphereId])


    return (
        <div
            className={styles.container}
        >
            {talkSphereId !== null ? (
                <div>
                    <ChatHeader
                        baseApiURL = {baseApiURL}
                        currentBasicData = { currentChat &&  { 
                            name: currentChat.name, 
                            imageData: currentChat.image_data
                        }}
                        fullBackgroundOpacity = { fullBackgroundOpacity }
                    />
                    <MessageContent
                        talkSphereId={talkSphereId}
                        talkSphereFolder = { currentChat && currentChat.talksphere_folder }
                    />
                    <MessageSender
                        talkSphereId={ talkSphereId }
                        fullBackgroundOpacity= { fullBackgroundOpacity }
                        receivers={ currentChat&& currentChat['receivers'] &&
                            currentChat.receivers
                        }
                        talkSphereFolder = { currentChat && currentChat['talksphere_folder']}
                    />
                    {
                        userChatDefaultSettings && uploadedBackground  && (
                            <div
                                className={styles.themesContainer}
                                style={userChatDefaultSettings && { opacity: userChatDefaultSettings.opacity,}
                                }
                            >
                                <img className={styles.imgBackground} src={uploadedBackground}/>
                            </div>
                        )
                    }
                </div>
            ) : (
                <div className={styles.welcomeSection}>
                    <img src={MessageSVG} width={90} height={90} />
                    <h1>Bienvenue sur l&apos;espace de Chat faite pour vous !!</h1>
                </div>
            )}
        </div>
    );
};

export default ChatBoard;

ChatBoard.propTypes = {
    uploadedBackground: PropTypes.object
}