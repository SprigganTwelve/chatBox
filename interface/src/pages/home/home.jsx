import { useContext, useEffect, useState } from 'react'
import { ChatBoxApiContext } from '/src/context/context'
import { useNavigate } from "react-router-dom"

import UserBoard from '/src/components/userBoard/user.board'
import ChatBoard from '/src/components/chatBoard/chat.board'
import Action from '/src/components/action/action'
import styles from "./home.module.css"


const Home = () => {
    const navigate = useNavigate()
    const [imageUploaded, setImageUploaded] = useState("")
    const { userId, userChatDefaultSettings } = useContext(ChatBoxApiContext)

    useEffect(()=>{
        if(!userId){
            navigate("/")
        }
    },[userId, navigate])

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
        <>
            <div className={styles.container}>
                <div className={styles.jsxComponentsContainer}>
                    <UserBoard />
                    <ChatBoard />
                    <Action />
                </div>
                {
                    userChatDefaultSettings && imageUploaded && userChatDefaultSettings.full && (
                        <div className={styles.fullBackground}>
                            <img src={imageUploaded} className={styles.img}/>
                        </div>
                    )
                }
            </div>
        </> 
    );
}
 
export default Home;