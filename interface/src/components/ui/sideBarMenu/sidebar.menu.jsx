
import { useContext } from "react"
import SVGmessage from "/src/assets/svg/message-square-list-svgrepo-com.svg"
import SVGinvit from "/src/assets/svg/invitation-svgrepo-com.svg"
import SVGstatus from  "/src/assets/svg/status2-svgrepo-com.svg"
import { ChatBoxApiContext } from "/src/context/context"
import { useNavigate } from "react-router-dom"
import styles from "./sidebar.menu.module.css"

const SideBarMenu = () => {

    const navigate = useNavigate()
    const { userData } = useContext(ChatBoxApiContext)
    console.log(userData)

    return ( 
        <div className={styles.container}>
            <div className={styles.menu}>
                <img 
                    className={styles.img}
                    src={SVGmessage}
                    onClick={()=>navigate("/home")}
                    alt="message"
                />
                <img
                    className={styles.img}
                    src={SVGinvit}
                    onClick={()=> navigate("/invitation")}
                    alt="invitation"
                />
                <img className={styles.img}
                     src={SVGstatus}
                     alt="status"
                />
            </div>
            <div className={styles.profil}>
                <img
                    src= {userData?.image ? "http://localhost:3000/uploads/" + userData.image : "/image/user/png-transparent-avatar-default-head-person-unknown-user-anonym-user-pictures-icon.png" }
                    onClick={()=> navigate("/profil") }
                    alt=""
                />
            </div>
        </div>
     );
}
 
export default SideBarMenu;