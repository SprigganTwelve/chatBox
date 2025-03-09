
import MessageBuddle from "/src/components/ui/messageBuddle/message.buddle"
import PropTypes from "prop-types"
import SVGcheck from "/src/assets/svg/check-circle-svgrepo-com.svg"
import styles from "./vibe.box.module.css"

const VibeBox = ({isFocus, imagePath, onClick}) => {
    return (
        <div
            className={styles.container}
            style={{
                border: isFocus && "5px solid white",
                backgroundImage: imagePath && `url(${imagePath})`,
                backgroundPosition: "center",
                backgroundSize: "cover"
            }}
            onClick={onClick}
        >
            <MessageBuddle
                isSent={false}
                containerStyle={{
                    width: 90
                }}
            />
            <MessageBuddle
                containerStyle={{
                    width: 90,
                }}
            />
            {
                isFocus &&       
            <img
                className={styles.icon}
                src={SVGcheck}
                alt=""
            />
            }
        </div>
    );
}
VibeBox.propTypes = {
    isFocus: PropTypes.bool,
    imagePath: PropTypes.string,
    onClick: PropTypes.func
}
 
export default VibeBox;