import { useContext, useEffect } from "react";
import { ChatBoxApiContext } from "/src/context/context";
import { useNavigate } from "react-router-dom";
import styles from "./invitation.module.css"

const Invitation = () => {
    const navigate = useNavigate()
    const { userId } = useContext(ChatBoxApiContext)

    useEffect(()=>{
        if(!userId){
            navigate("/home")
        }
    }, [userId])

    return ( 
        <div className={styles.container}>
            <span className={styles.mainTitle}>Invitation</span>
            <div></div>
            <div></div>
        </div>
     );
}
 
export default Invitation;