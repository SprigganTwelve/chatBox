import { useContext } from "react";
import { ChatBoxApiContext } from "../../context/context"
import UserCard from "./components/userCard/user.card";
import SearchBar from "./components/searchbar"
import styles from "./user.board.module.css"

const UserBoard = () => {

    const { friends, setCurrentChatId, setTalkSphereId } = useContext(ChatBoxApiContext)

    return (
        <div  className={styles.container}>
            <SearchBar />
            { friends.map((friend, index)=>(
                        <UserCard  
                            key={index}
                            url={friend.image}
                            name={friend.name}
                            online={false}
                            onClick={ ()=>{ 
                                setCurrentChatId(friend.id)
                                setTalkSphereId(friend.talkSphereId)
                                localStorage.setItem("currentChatId", JSON.stringify(friend.id));
                                localStorage.setItem("talkSphereId", JSON.stringify(friend.talkSphereId));
                            } } 
                            />
                        ))
                    }        
        </div>
     );
}
 
export default UserBoard;