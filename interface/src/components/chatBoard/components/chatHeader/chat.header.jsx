
import PropTypes from "prop-types"

import styles from "./chat.header.module.css"



    
const ChatHeader = ({  fullBackgroundOpacity, currentBasicData }) => {
    
    return (
        <>
            { currentBasicData ? (
                <div 
                    className={styles.header}
                    style={{
                        "--opacityBackground" : fullBackgroundOpacity
                    }}
                >
                    <img 
                        src={ currentBasicData.imageData != "" ?
                            `${baseApiURL.current}/uploads/users/${currentBasicData.imageData.folder}/parameters/${currentBasicData.imageData.image}` 
                            : "/image/user/png-transparent-avatar-default-head-person-unknown-user-anonym-user-pictures-icon.png"
                        }
                        alt="profil"
                    />
                    <span className={styles.name}>{currentBasicData.name}</span>
                </div>
            ) : (
                <div style={{color: "white"}} /> 
            )}
        </>
    );
};

ChatHeader.propTypes = {
    currentBasicData: PropTypes.shape({
        name: PropTypes.string,
        imageData: PropTypes.shape({
            folder: PropTypes.string,
            image: PropTypes.string
        })
    }),
    fullBackgroundOpacity: PropTypes.number,
}

export default ChatHeader;
