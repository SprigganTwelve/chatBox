import { createRoot } from 'react-dom/client'
import { ChatBoxApiContextProvider } from '/src/context/context'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <ChatBoxApiContextProvider>
        <App />
    </ChatBoxApiContextProvider>
)
