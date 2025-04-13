
import PropTypes from "prop-types"
import clsx from "clsx"
import styles from "./user.card.module.css"

const UserCard = ({
    url,
    name,
    style,
    onClick,
    isActive,
}) => {
    return ( 
        <div className={clsx(styles.main, isActive && styles.isActive)} onClick={onClick} style={style} >
            <div>
                <div id="imageContainer" className={styles.imageContainer}>
                    <img id="image"
                         src={url ? "http://localhost:3000/uploads/" + url : "/image/user/png-transparent-avatar-default-head-person-unknown-user-anonym-user-pictures-icon.png"}
                         className={styles.image}
                         alt="image"
                    />
                </div>
            </div>
            <div className={styles.textBox}>
                <span className={styles.name}>{name}</span>
                <span className={styles.date}>10/02/2025</span>
            </div>
        </div>
     );
}

UserCard.propTypes = {
    url: PropTypes.string,
    name: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.object,
    isActive: PropTypes.bool,
}
 
export default UserCard;