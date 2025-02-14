
import styles from "./user.card.module.css"

const UserCard = ({
    url
}) => {

    return ( 
        <div className={styles.main}>
            <div>
                <div id="imageContainer" className={styles.imageContainer}>
                    <img id="image" src={url} className={styles.image} alt="image" />
                </div>
            </div>
            <div className={styles.textBox}>
                <span className={styles.name}>Haruto</span>
                <span className={styles.date}>10/02/2025</span>
            </div>
        </div>
     );
}
 
export default UserCard;