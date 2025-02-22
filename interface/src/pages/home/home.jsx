import UserBoard from '/src/components/userBoard/user.board'
import ChatBoard from '/src/components/chatBoard/chat.board'
import Action from '/src/components/action/action'
import styles from "./home.module.css"
import { useContext, useEffect } from 'react'
import { ChatBoxApiContext } from '/src/context/context'
import { useNavigate } from "react-router-dom"

const Home = () => {
    const navigate = useNavigate()
    const { userId } = useContext(ChatBoxApiContext)

    useEffect(()=>{
        if(!userId){
            navigate("/")
        }
    },[userId, navigate])

    return ( 
        <>
            <div className={styles.container}>
                <UserBoard />
                <ChatBoard />
                <Action />
            </div>
        </> 
    );
}
 
export default Home;