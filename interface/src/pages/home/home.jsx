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
    const { userId, userData, userChatDefaultSettings } = useContext(ChatBoxApiContext)

    useEffect(()=>{
        if(!userId){
            navigate("/")
        }
    },[userId, navigate])

    useEffect(()=>{
        if (userChatDefaultSettings) {
            const imageLoader = new Image()

            imageLoader.src = `http://localhost:3000/uploads/themes/${userChatDefaultSettings.theme}`
           
            imageLoader.onload = ()=>{ setImageUploaded(() => imageLoader.src) }

            imageLoader.onerror = ()=>{
                imageLoader.src= `http://localhost:3000/uploads/users/${ userData.folder }/parameters/${userChatDefaultSettings.theme}`
               
                imageLoader.onload = ()=>{setImageUploaded(() => imageLoader.src)}

                imageLoader.onerror = ()=>{console.log("something went wrong")}
            }

        }
    },[userChatDefaultSettings, userData])

    return ( 
        <>
            <div className={styles.container}>
                <div className={styles.jsxComponentsContainer}>
                    <UserBoard />
                    <ChatBoard uploadedBackground = {userChatDefaultSettings && !userChatDefaultSettings?.full  ? imageUploaded : null}/>
                    <Action />
                </div>
                {
                    userChatDefaultSettings && userChatDefaultSettings.full && (
                        <div className={styles.fullBackground}>
                            <img src={imageUploaded} className={styles.img} style={{ opacity: userChatDefaultSettings.opacity  }}/>
                        </div>
                    )
                }
            </div>
        </> 
    );
}
 
export default Home;