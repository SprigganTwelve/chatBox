import { useContext } from "react";
import ChatHeader from "./components/chatHeader/chat.header";
import MessageContent from "./components/messageContent/message.content";
import MessageSender from "./components/messageSender/message.sender";
import MessageSVG from "/src/assets/svg/chat-round-line-svgrepo-com.svg";
import styles from './chat.board.module.css';
import { ChatBoxApiContext } from "../../context/context";

const ChatBoard = () => {
    const { talkSphereId, currentChatId } = useContext(ChatBoxApiContext)


    return (
        <div className={styles.container}>
            {talkSphereId !== null ? (
                <div>
                    <ChatHeader currentChatId={currentChatId} />
                    <MessageContent talkSphereId={talkSphereId} />
                    <MessageSender currentChatId={talkSphereId} />
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
