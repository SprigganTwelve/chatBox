
import SVGmessage from "/src/assets/svg/message-square-list-svgrepo-com.svg"
import SVGinvit from "/src/assets/svg/invitation-svgrepo-com.svg"
import SVGstatus from  "/src/assets/svg/status2-svgrepo-com.svg"
import styles from "./sidebar.menu.module.css"

const SideBarMenu = () => {
    return ( 
        <div className={styles.container}>
            <div className={styles.menu}>
                <img className={styles.img} src={SVGmessage} alt="message" />
                <img className={styles.img} src={SVGinvit} alt="invitation" />
                <img className={styles.img} src={SVGstatus} alt="status" />
            </div>
            <div className={styles.profil}>
                <img  src="/image/user/png-transparent-avatar-default-head-person-unknown-user-anonym-user-pictures-icon.png" alt="" />
            </div>
        </div>
     );
}
 
export default SideBarMenu;