import UserCard from "./components/user.card";
import { useContext, useEffect } from "react";
import { ChatBoxApiContext } from "../../context/context"
import styles from "./user.board.module.css"

const UserBoard = () => {

    const { users } = useContext(ChatBoxApiContext)

    useEffect(()=>{
        console.log(users)
    }, [])


    return ( 
        <div className={styles.container}>
            <UserCard url='/image/user/haruto.jpg' name="haruto" online={false} />
        </div>
     );
}
 
export default UserBoard;