import UserCard from "./components/user.card";
import { useContext } from "react";
import { ChatBoxApiContext } from "../../context/context"
import styles from "./user.board.module.css"

const UserBoard = () => {

    const { users, currentChatId, setCurrentChatId } = useContext(ChatBoxApiContext)


    return ( 
        <div className={styles.container}>
            <UserCard  url={users[0].image} name={users[0].name} online={false} currentChatId={currentChatId}  onClick={ ()=>{ localStorage.setItem("currentChatId", JSON.stringify(users[0].id)); setCurrentChatId(users[0].id) } } />
            <UserCard  url={users[1].image} name={users[1].name} online={false} currentChatId={currentChatId}  onClick={ ()=>{ localStorage.setItem("currentChatId", JSON.stringify(users[1].id)); setCurrentChatId(users[1].id) } } />
            <UserCard  url={users[2].image} name={users[2].name} online={false} currentChatId={currentChatId}  onClick={ ()=>{ localStorage.setItem("currentChatId", JSON.stringify(users[2].id)); setCurrentChatId(users[2].id) } } />
            <UserCard  url={users[3].image} name={users[3].name} online={false} currentChatId={currentChatId}  onClick={ ()=>{ localStorage.setItem("currentChatId", JSON.stringify(users[3].id)); setCurrentChatId(users[3].id) } } />
        </div>
     );
}
 
export default UserBoard;