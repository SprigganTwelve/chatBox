
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { ChatBoxApiContext } from "/src/context/context";
import EditProfileSettings from '/src/components/profile/editProfileSettings/edit.profile.settings'
import NotificationSettings from "/src/components/profile/notificationSettings/notification.settings"
import InterfaceSettings from "/src/components/profile/interfaceSettings/interface.settings"
import Confidentiality from "/src/components/profile/confidentiality/confidentiality"
import styles from "./profil.module.css"

const Profil = () => {
    const { userId, setUserId, userData } = useContext(ChatBoxApiContext)
    const navigate = useNavigate()
    const [isButtonActive, setIsButtonActive] = useState("Edit")

    useEffect(()=>{
        if(!userId){
            navigate("/")
        }
    },
    [userId])

    return (
        <div className={styles.container}>
            { userData && (
              <>
                <div className={styles.leftBoard}>
                    <div className={styles.imageContainer}>
                        <img
                            src={userData?.image ? "http://localhost:3000/uploads/" + userData.image : "/image/randomUser.png" }
                            className={styles.imageProfil}
                            alt=""
                        />
                    </div>
                    <div className={styles.textSection}>
                            <p>
                                <span className={styles.userName}>{userData?.name.charAt(0).toUpperCase() + userData?.name.slice(1).toLowerCase()} {userData?.pseudo !="..." && "/" + userData?.pseudo}</span>
                            </p>
                        <div className={styles.separator} />
                        <div>
                             <button 
                                className={isButtonActive == "Edit" ? styles.isActive : ""}
                                onClick={() => {
                                    setIsButtonActive("Edit")
                                }}
                            >
                                Account Settings
                            </button>
                            <button
                                className={isButtonActive == "Discussion" ? styles.isActive : ""}
                                onClick={() => {
                                    setIsButtonActive("Discussion")
                                }}
                            >
                                Interface settings
                            </button>
                            <button
                                className={isButtonActive == "confidentiality" ? styles.isActive : ""}
                                onClick={() => {
                                    setIsButtonActive("confidentiality")
                                }}
                            >
                                Confiedentality
                            </button>
                            <button
                                className={isButtonActive == "Notification" ? styles.isActive : ""}
                                onClick={() => {
                                    setIsButtonActive("Notification")
                                }}
                            >
                                Notification
                            </button>
                            <button
                                className={styles.deconnexion}
                                onClick={() => {
                                    localStorage.clear()
                                    setUserId(null)
                                    navigate("/")
                                }}
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.rightBoard}>
                    {
                        userData && isButtonActive=="Edit" && (
                            <EditProfileSettings userData={userData}/>
                        )
                    }
                    {
                        userData && isButtonActive =="Discussion" && (
                            <InterfaceSettings />
                        )
                    }
                    {
                        userData && isButtonActive == "confidentiality" && (
                            <Confidentiality />
                        )
                    }
                    {
                        userData && isButtonActive == "Notification" && (
                            <NotificationSettings />
                        )
                    }
                </div>
              </>
            )}
        </div>
      );
}
 
export default Profil;