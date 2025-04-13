
import { useContext, useState } from "react"
import clsx from 'clsx';
import SVGmessage from "/src/assets/svg/message-square-list-svgrepo-com.svg"
import SVGinvit from "/src/assets/svg/invitation-svgrepo-com.svg"
import SVGstatus from  "/src/assets/svg/status2-svgrepo-com.svg"
import { ChatBoxApiContext } from "/src/context/context"
import { useNavigate } from "react-router-dom"
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
                <img 
                    alt="message"
                    src={SVGmessage}
                    onClick={()=> handleChangeActiveMenu("message", "/home")}
                    className={clsx(styles.img,isActive === "message" ? styles.isActive : "")}
                    style={{
                        "--backGroundOpacity": fullBackgroundOpacity
                    }}
                />
                <img
                    src={SVGinvit}
                    alt="invitation"
                    onClick={()=> handleChangeActiveMenu("invit","/invitation") }
                    className={clsx(styles.img,isActive === "invit" ? styles.isActive : "")}
                    style={{
                        "--backGroundOpacity": fullBackgroundOpacity
                    }}
                />
                <img 
                    alt="status"
                    src={SVGstatus}
                    onClick={()=> handleChangeActiveMenu("status","/status") }
                    className={clsx(styles.img, isActive === "status" ? styles.isActive : "")}
                    style={{
                        "--backGroundOpacity": fullBackgroundOpacity
                    }}
                />
            </div>
            <div className={styles.profil}>
                <img
                    alt="profil"
                    onClick={()=> handleChangeActiveMenu("", "/profil")}
                    src= {userData?.image ? "http://localhost:3000/uploads/" + userData.image : "/image/user/png-transparent-avatar-default-head-person-unknown-user-anonym-user-pictures-icon.png" }
                />
            </div>
        </div>
     );
}
 
export default SideBarMenu;