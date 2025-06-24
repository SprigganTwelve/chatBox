
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"
import { ChatBoxApiContext } from "/src/context/context";

import EditProfileSettings from '/src/components/profile/editProfileSettings/edit.profile.settings'
import NotificationSettings from "/src/components/profile/notificationSettings/notification.settings"
import InterfaceSettings from "/src/components/profile/interfaceSettings/interface.settings"
import Confidentiality from "/src/components/profile/confidentiality/confidentiality"

import SmartImageProcessor from "/src/components/ui/smartImageProcesor/smart.image.processor";

import styles from "./profil.module.css"
import Modal from "/src/components/ui/modal/modal";

const Profil = () => {
    const navigate = useNavigate()
    const inputFileRef = useRef(null)

    const { 
        userId,
        userData,
        setUserId,
        setUserData,
        userChatDefaultSettings,
    } = useContext(ChatBoxApiContext)
    
    const [isButtonActive, setIsButtonActive] = useState("Edit")
    const [croppedProfileImage, setCroppedProfileImge] = useState(null)

    const [ selectedFile,  setSelectedFile ] = useState(null)


    useEffect(()=>{
        if(!userId){
            navigate("/")
        }
    },
    [userId, navigate, userData])

    useEffect(()=>{
        if(croppedProfileImage) 
            setUserData((prev) => ({...prev, image: URL.createObjectURL(croppedProfileImage) }))
    },[croppedProfileImage, setUserData])

    return (
        <div className={styles.container}>
            { userData && (
              <>
                <div className={styles.leftBoard}>
                    <div 
                        className={styles.imageContainer}
                        onClick={()=> inputFileRef.current.click()}
                    >
                        <img
                            alt=""
                            src={ 
                                    userData?.image
                                    ? (userData.image.startsWith("blob") 
                                        ? userData.image 
                                        : `http://localhost:${import.meta.env.VITE_API_PORT }/uploads/users/${ userData.folder }/parameters/`+ userData.image.trim() )
                                    : "/image/randomUser.png"
                                }
                            className={styles.imageProfil}
                        />
                        <input 
                            hidden
                            type="file" 
                            ref={inputFileRef}
                            onChange={ ()=>{
                                if (inputFileRef.current) {
                                    const file = inputFileRef.current?.files?.[0]
                                    setSelectedFile(file)
                                }
                            }}
                        />
                    </div>
                    <Modal 
                        open={ !!selectedFile }
                        showCancelAndConfirmButtons={true}
                        onClose = {()=>{ 
                            setSelectedFile(null)
                            inputFileRef.current.value = null
                        }}
                        onContinueHandler={() => {
                            SmartImageProcessor.handleSaveCroppedImage()
                        }} 
                    >
                        <SmartImageProcessor
                            ratio = { 1 }
                            shape = "round"
                            idInBdd=  { userData.id }
                            inputRef= { inputFileRef }
                            folder = { userData.folder }
                            setCroppedFile = { setCroppedProfileImge }
                            url= "http://localhost:3000/users/profile/image"
                            fileUrl={ selectedFile && URL.createObjectURL(selectedFile) }
                        />   
                    </Modal>
                    <div className={styles.textSection}>
                            <p>
                                <span className={styles.userName}>
                                    {userData?.name.charAt(0).toUpperCase() + userData?.name.slice(1).toLowerCase()} {userData?.pseudo !="..." && " / " + userData?.pseudo}
                                </span>
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
                            <InterfaceSettings 
                                userFolder= { userData.folder }
                                defaultSettings={userChatDefaultSettings}
                            />
                        )
                    }
                    {
                        userData && isButtonActive == "confidentiality" && (
                            <Confidentiality
                                defaultSettings = {userChatDefaultSettings}
                            />
                        )
                    }
                    {
                        userData && isButtonActive == "Notification" && (
                            <NotificationSettings
                                defaultSettings = { userChatDefaultSettings }
                            />
                        )
                    }
                </div>
              </>
            )}
        </div>
      );
}
 
export default Profil;