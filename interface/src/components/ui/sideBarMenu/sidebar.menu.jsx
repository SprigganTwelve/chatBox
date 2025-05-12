
import { useContext, useState } from "react"
import clsx from 'clsx';

import { ChatBoxApiContext } from "/src/context/context"
import SVGmessage from "/src/assets/svg/message-square-list-svgrepo-com.svg"

import SVGinvit from "/src/assets/svg/invitation-svgrepo-com.svg"
import SVGstatus from  "/src/assets/svg/status2-svgrepo-com.svg"
import { useNavigate } from "react-router-dom"

import AboutOverlay from "/src/components/ui/aboutOverlay/about.overlay";

import styles from "./sidebar.menu.module.css"

const SideBarMenu = () => {

    const navigate = useNavigate()
    const { userData, fullBackgroundOpacity } = useContext(ChatBoxApiContext)
    const [isActive, setIsActive] = useState(()=>{
        const saved = JSON.parse(localStorage.getItem("menu"))
        return saved ?? "message"
    })

    const handleChangeActiveMenu = (menu, route) => {
            setIsActive(menu)
            navigate(route)
            localStorage.setItem("menu", JSON.stringify(menu))
            window.location.reload()
    }


    return ( 
        <div className={styles.container}>
            <div className={styles.menu}>
                <AboutOverlay text="Message">
                    <img 
                        alt="message"
                        src={SVGmessage}
                        onClick={()=> handleChangeActiveMenu("message", "/home")}
                        className={clsx(styles.img,isActive === "message" ? styles.isActive : "")}
                        style={{
                            "--backGroundOpacity": fullBackgroundOpacity
                        }}
                    />
                </AboutOverlay>
                <AboutOverlay text = "Invitation">
                    <img
                        src={SVGinvit}
                        alt="invitation"
                        onClick={()=> handleChangeActiveMenu("invit","/invitation") }
                        className={clsx(styles.img,isActive === "invit" ? styles.isActive : "")}
                        style={{
                            "--backGroundOpacity": fullBackgroundOpacity
                        }}
                    />
                </AboutOverlay>
                <AboutOverlay text="Status">
                    <img 
                        alt="status"
                        src={SVGstatus}
                        onClick={()=> handleChangeActiveMenu("status","/status") }
                        className={clsx(styles.img, isActive === "status" ? styles.isActive : "")}
                        style={{
                            "--backGroundOpacity": fullBackgroundOpacity
                        }}
                    />
                </AboutOverlay>
            </div>
            <div className={styles.profilSection}>
                    <AboutOverlay 
                        text="Profil"
                    >
                        <img
                            alt="profil"
                            className={ styles.profilImage }
                            onClick={()=> handleChangeActiveMenu("", "/profil")}
                            src= { 
                                userData?.image
                                ? (userData.image.startsWith("blob") 
                                    ? userData.image 
                                    : `http://localhost:3000/uploads/users/${ userData.folder }/parameters/`+ userData.image.trim() )
                                : "/image/randomUser.png"
                            }
                        />
                    </AboutOverlay>
            </div>
        </div>
     );
}
 
export default SideBarMenu;