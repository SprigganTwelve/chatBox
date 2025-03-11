import { useContext, useState } from "react";
import { ChatBoxApiContext } from "../../context/context"
import UserCard from "./components/userCard/user.card";
import SearchBar from "/src/components/ui/searchBar/searchbar"

import SVGbox from "/src/assets/svg/box-svgrepo-com.svg"
import styles from "./user.board.module.css"

const UserBoard = () => {

    const { friends, setCurrentChatId, setTalkSphereId, setUsersTemporaryChat  } = useContext(ChatBoxApiContext)
    const [isUserActive, setIsUserActive] = useState({})

    const toggleInvite = (id) => {
        setIsUserActive((prev) => ({
            [id]: !prev[id]
        }));
    };

    return (
        <div  className={styles.container}>
            <div className={styles.title}>
                <img src={SVGbox} width={30} alt="" />
                ChatBox
            </div>
            <SearchBar />
            { friends.map((friend, index)=>(
                        <UserCard  
                            key={index}
                            url={friend.image}
                            name={friend.name}
                            online={false}
                            isActive={isUserActive[index]}
                            onClick={ ()=>{ 
                                setCurrentChatId(friend.id)
                                setTalkSphereId(friend.talkSphereId)
                                localStorage.setItem("currentChatId", JSON.stringify(friend.id));
                                localStorage.setItem("talkSphereId", JSON.stringify(friend.talkSphereId));
                                setUsersTemporaryChat(()=> ({
                                    id: friend.talkSphereId,
                                    messages: []
                                }))
                                toggleInvite(index)
                            } } 
                            />
                        ))
                    }        
        </div>
     );
}
 
export default UserBoard;