import { useContext } from "react";
import { ChatBoxApiContext } from "../../context/context";
import ChatHeader from "./components/chatHeader/chat.header";
import MessageContent from "./components/messageContent/message.content";
import MessageSender from "./components/messageSender/message.sender";
import MessageSVG from "/src/assets/svg/chat-round-line-svgrepo-com.svg";
import styles from './chat.board.module.css';

const ChatBoard = () => {
    const { talkSphereId, currentChatId, userChatDefaultSettings,  usersTemporaryChat, socket, setUsersTemporaryChat } = useContext(ChatBoxApiContext)

    return (
        <div className={styles.container}>
            {talkSphereId !== null ? (
                <div>
                    <ChatHeader currentChatId={currentChatId} />
                    <MessageContent
                        socket={socket}
                        talkSphereId={talkSphereId}
                        currentChatId={currentChatId}
                        usersTemporaryChat = {usersTemporaryChat}
                        setUsersTemporaryChat= {setUsersTemporaryChat}
                    />
                    <MessageSender
                        talkSphereId={talkSphereId}
                        currentChatId={currentChatId}
                    />
                    <div
                        className={styles.themesContainer}
                        style={userChatDefaultSettings && 
                            {
                                opacity: userChatDefaultSettings.opacity,
                                backgroundImage: `url(http://localhost:3000/uploads/themes/${userChatDefaultSettings.themes})`,
                            }
                        }
                    />
                    <div 
                        style={{ }}
                        className={styles.colorOVerlay}
                    />
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
