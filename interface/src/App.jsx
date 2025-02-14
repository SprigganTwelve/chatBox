import UserBoard from './components/userBoard/user.board'
import ChatBoard from './components/chatBoard/chat.board'
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
