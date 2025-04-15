
import { useContext } from "react";
import styles from "./action.module.css"
import { ChatBoxApiContext } from "/src/context/context";
import SVGcall from "/src/assets/svg/call-receive-svgrepo-com.svg"
import SVGvideo from "/src/assets/svg/video-call-svgrepo-com.svg"
import SVGoptions from "/src/assets/svg/options-vertical-svgrepo-com.svg"

const Action = () => {
    const { talkSphereId } = useContext(ChatBoxApiContext)
    return ( 
        <>
            {
                talkSphereId && (
                    <div className={styles.container}>
                        <img src={SVGcall} className={styles.icon}/>
                        <img src={SVGvideo} className={styles.icon} />
                        <img src={SVGoptions} className={styles.icon} />
                    </div>
                )
            }
        </>
     );
}
 
export default Action;