import UserBoard from './components/user-board/user.board'
import ChatBoard from './components/chat-board/chat.board'
import Settings from './components/settings/settings'
import { ChatBoxApiContextProvider } from './context/context'

import styles from "./App.module.css"


function App() {

  return (  
    <ChatBoxApiContextProvider>
      <div className={styles.container}>
        <UserBoard />
        <ChatBoard />
        <Settings />
      </div>
    </ChatBoxApiContextProvider>
  )
}

export default App
