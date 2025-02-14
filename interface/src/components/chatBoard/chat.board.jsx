import { useContext } from "react"
import { ChatBoxApiContext } from '../../context/context'
import ChatHeader from "./components/chatHeader/chat.header"
import MessageContent from "./components/messageContent/message.content"
import MessageSender from "./components/messageSender/message.sender"
import MessageSVG  from "/src/assets/svg/chat-round-line-svgrepo-com.svg"

import styles from './chat.board.module.css'

const ChatBoard = () => {
    const { currentChatId } = useContext(ChatBoxApiContext)
    console.log(currentChatId)

    return ( 
        <div className={styles.container}>
            {
                currentChatId !== 0 ? 
                    <div>
                        <ChatHeader currentChatId={ currentChatId } />
                        <MessageContent />
                        <MessageSender />
                    </div>

                :   <div className={styles.welcomeSection}>
                        <img src={MessageSVG} width={90} height={90} />
                        <h1>Bienvenue sur l&apos;espace de Chat faite pour vous !!</h1>
                    </div>
            }
        </div>
     );
}
 
export default ChatBoard;