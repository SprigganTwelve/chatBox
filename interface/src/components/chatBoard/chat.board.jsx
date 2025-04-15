import {  useContext, useEffect } from "react";
import { ChatBoxApiContext } from "../../context/context";
import ChatHeader from "./components/chatHeader/chat.header";
import MessageContent from "./components/messageContent/message.content";
import MessageSender from "./components/messageSender/message.sender";
import MessageSVG from "/src/assets/svg/chat-round-line-svgrepo-com.svg";
import styles from './chat.board.module.css';
import { useState } from "react";

const ChatBoard = () => {

    const [imageUploaded, setImageUploaded] = useState("")
    const { talkSphereId, userChatDefaultSettings, fullBackgroundOpacity } = useContext(ChatBoxApiContext)


    useEffect(()=>{
        if (userChatDefaultSettings) {
            const imageLoader = new Image()

            console.log(userChatDefaultSettings)
            imageLoader.src = `http://localhost:3000/uploads/themes/${userChatDefaultSettings.theme}`
           
            imageLoader.onload = ()=>{ setImageUploaded(() => imageLoader.src) }

            imageLoader.onerror = ()=>{
                imageLoader.src= `http://localhost:3000/uploads/themes/customizes/${userChatDefaultSettings.theme}`
               
                imageLoader.onload = ()=>{setImageUploaded(() => imageLoader.src)}

                imageLoader.onerror = ()=>{console.log("something went wrong")}
            }

        }
    },[userChatDefaultSettings])


    return (
        <div
            className={styles.container}
        >
            {talkSphereId !== null ? (
                <div>
                    <ChatHeader fullBackgroundOpacity = { fullBackgroundOpacity }/>
                    <MessageContent talkSphereId={talkSphereId} />
                    <MessageSender
                        talkSphereId={talkSphereId}
                        fullBackgroundOpacity= { fullBackgroundOpacity }
                    />
                    {
                        userChatDefaultSettings && imageUploaded &&  !userChatDefaultSettings.full && (
                            <div
                                className={styles.themesContainer}
                                style={userChatDefaultSettings && { opacity: userChatDefaultSettings.opacity,}
                                }
                            >
                                <img className={styles.imgBackground} src={imageUploaded}/>
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
