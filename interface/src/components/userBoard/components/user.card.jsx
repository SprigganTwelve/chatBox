
import styles from "./user.card.module.css"

const UserCard = ({
    url,
    name,
    onClick,
    currentChatId
}) => {

    return ( 
        <div className={styles.main} onClick={onClick}>
            <div>
                <div id="imageContainer" className={styles.imageContainer}>
                    <img id="image" src={url} className={styles.image} alt="image" />
                </div>
            </div>
            <div className={styles.textBox}>
                <span className={styles.name}>{name}</span>
                <span className={styles.date}>10/02/2025</span>
            </div>
        </div>
     );
}
 
export default UserCard;