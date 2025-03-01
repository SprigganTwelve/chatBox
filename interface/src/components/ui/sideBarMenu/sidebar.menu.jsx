
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
    const { userData } = useContext(ChatBoxApiContext)
    const [isActive, setIsActive] = useState("message")    


    return ( 
        <div className={styles.container}>
            <div className={styles.menu}>
                <img 
                    className={clsx(styles.img,isActive === "message" ? styles.isActive : "")}
                    src={SVGmessage}
                    onClick={()=>{
                        setIsActive("message")
                        navigate("/home")
                    }}
                    alt="message"
                />
                <img
                    className={clsx(styles.img,isActive === "invit" ? styles.isActive : "")}
                    src={SVGinvit}
                    onClick={()=> {
                        setIsActive("invit")
                        navigate("/invitation")
                    }}
                    alt="invitation"
                />
                <img className={clsx(styles.img,isActive === "status" ? styles.isActive : "")}
                     src={SVGstatus}
                     onClick={()=> {
                        setIsActive("status")
                        navigate("/status")
                    }}
                     alt="status"
                />
            </div>
            <div className={styles.profil}>
                <img
                    src= {userData?.image ? "http://localhost:3000/uploads/" + userData.image : "/image/user/png-transparent-avatar-default-head-person-unknown-user-anonym-user-pictures-icon.png" }
                    onClick={()=> {
                        setIsActive("")
                        navigate("/profil")
                    } }
                    alt=""
                />
            </div>
        </div>
     );
}
 
export default SideBarMenu;