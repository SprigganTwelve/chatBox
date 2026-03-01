import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from 'react'

import { ChatBoxApiContext } from '/src/context/context'
import SideBarContextProvider from '/src/context/sidebar.context';

import UserBoard from '/src/components/userBoard/user.board'
import ChatBoard from '/src/components/chatBoard/chat.board'
import Action from '/src/components/action/action'

import styles from "./home.module.css"



const Home = () => {
    const navigate = useNavigate()
    const [imageUploaded, setImageUploaded] = useState("")
    const { socket, userId, userData, userChatDefaultSettings, talkSphereId, baseApiURL } = useContext(ChatBoxApiContext)

    useEffect(()=>{
        if(!userId){
            navigate("/")
        }
    },[userId, navigate, socket])

    useEffect(()=>{
        if (userChatDefaultSettings) {
            const imageLoader = new Image()

            imageLoader.src = `${baseApiURL.current}/uploads/themes/${userChatDefaultSettings.theme}`
           
            imageLoader.onload = ()=>{ setImageUploaded(() => imageLoader.src) }

            imageLoader.onerror = ()=>{
                imageLoader.src= `${baseApiURL.current}/uploads/users/${ userData.folder }/parameters/${userChatDefaultSettings.theme}`
               
                imageLoader.onload = ()=>{setImageUploaded(() => imageLoader.src)}

                imageLoader.onerror = ()=>{console.log("something went wrong")}
            }

        }
    },[userChatDefaultSettings, userData])

    return ( 
        <>
            <div 
                className={styles.container}
            >
                <div className={styles.jsxComponentsContainer}>
                    <SideBarContextProvider>
                        <UserBoard />
                    </SideBarContextProvider>
                    <ChatBoard />
                    <Action />
                </div>
                {
                    userChatDefaultSettings && userChatDefaultSettings.full && (
                        <div className={styles.fullBackground}>
                            <div 
                                className={styles.blackForeground}
                                style={{ background: talkSphereId ? 'rgba(0, 0, 0)' : 'rgb(67, 65, 65)'}}
                            />
                            <img src={imageUploaded} className={styles.img} style={{ opacity: userChatDefaultSettings.opacity  }}/>
                        </div>
                    )
                }
            </div>
        </> 
    );
}
 
export default Home;