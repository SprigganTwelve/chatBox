
import MessageBuddle from "/src/components/ui/messageBuddle/message.buddle"
import PropTypes from "prop-types"
import SVGcheck from "/src/assets/svg/check-circle-svgrepo-com.svg"
import styles from "./vibe.box.module.css"

const VibeBox = ({ isFocus, imageUrl, onClick, opacity }) => {
    const regularOpacity = 1
    return (
        <div
            className={styles.container}
            style={{
                border: isFocus && "5px solid white",
                backgroundImage: imageUrl && `url(${imageUrl})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                opacity: opacity
            }}
            onClick={onClick}
        >
            <MessageBuddle
                isSent={false}
                containerStyle={{
                    width: 90,
                    opacity: regularOpacity
                }}
            />
            <MessageBuddle
                containerStyle={{
                    width: 90,
                    opacity: regularOpacity
                }}
            />
            {
                isFocus &&       
            <img
                alt=""
                src={SVGcheck}
                className={styles.icon}
                style={{
                    opacity: regularOpacity
                }}
            />
            }
        </div>
    );
}
VibeBox.propTypes = {
    isFocus: PropTypes.bool,
    onClick: PropTypes.func,
    opacity: PropTypes.number,
    imageUrl: PropTypes.string,
}
 
export default VibeBox;