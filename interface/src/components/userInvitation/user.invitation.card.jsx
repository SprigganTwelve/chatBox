
import { useState } from "react"
import styles from "./user.invitaion.card.module.css"
import isAvailableIcon from "/src/assets/svg/userIsAvailable.svg"
import isNotAvailablilityIcon from "/src/assets/svg/userIsNotAvailable.svg"

const UserInvitationCard = ({userId, userName, userImage, userAvaibility}) => {

    const [isInvite, setIsInvite] = useState(false)

    return ( 
        <div className={styles.container}>
            <img 
                src={ userImage ? `http://localhost:3000/uploads/${userImage}` : "/image/user/png-transparent-avatar-default-head-person-unknown-user-anonym-user-pictures-icon.png"}
                className={styles.profilImage}
                alt="userImage"
            />
            <div className={styles.textSection}>
                <span className={styles.userName}>{userName}</span>
                <div>
                    <img src={userAvaibility ? isAvailableIcon : isNotAvailablilityIcon } className={styles.icon}  alt="Time icon" />
                    <span className={styles.textAboutAvailability}>{userAvaibility ? "Available" : "Unavailable"}</span>
                </div>
                <button 
                    className={styles.invitButton}
                    style={{color: isInvite? "#EEE4B1": "white"}}
                    onClick={()=>{
                        setIsInvite(!isInvite)
                    }}
                >
                    {isInvite ? "Cancel": "Invit"}
                </button>
            </div>
        </div>
     );
}
 
export default UserInvitationCard;