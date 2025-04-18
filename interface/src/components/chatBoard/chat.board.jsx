import PropTypes from 'prop-types'
import {  useContext, useEffect, useRef } from "react";
import { ChatBoxApiContext } from "../../context/context";

import ChatHeader from "./components/chatHeader/chat.header";
import MessageContent from "./components/messageContent/message.content";
import MessageSender from "./components/messageSender/message.sender";
import MessageSVG from "/src/assets/svg/chat-round-line-svgrepo-com.svg";

import styles from './chat.board.module.css';




const ChatBoard = ({ uploadedBackground }) => {

    const currentChat = useRef(null)
    const { allChats, talkSphereId, userChatDefaultSettings, fullBackgroundOpacity } = useContext(ChatBoxApiContext)

    useEffect(()=>{
        if(allChats && talkSphereId && allChats.length > 0){
            const index = allChats.findIndex((item)=> item.id == talkSphereId)
            if(index != -1) currentChat.current = allChats[index]
        }
    },[allChats, talkSphereId])


    return (
        <div
            className={styles.container}
        >
            {talkSphereId !== null ? (
                <div>
                    <ChatHeader fullBackgroundOpacity = { fullBackgroundOpacity }/>
                    <MessageContent talkSphereId={talkSphereId} />
                    <MessageSender
                        talkSphereId={ talkSphereId }
                        fullBackgroundOpacity= { fullBackgroundOpacity }
                        receivers={ currentChat.current && currentChat.current['receivers'] &&
                             currentChat.current.receivers
                        }
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