import { useContext, useState } from "react";
import { ChatBoxApiContext } from "../../context/context"
import UserCard from "./components/userCard/user.card";
import SearchBar from "/src/components/ui/searchBar/searchbar"

import SVGbox from "/src/assets/svg/box-svgrepo-com.svg"
import styles from "./user.board.module.css"
import axios from "axios";

const UserBoard = () => {

    const {userId,  friends, setCurrentChatId, setTalkSphereId, setUsersTemporaryChat  } = useContext(ChatBoxApiContext)
    const [isUserActive, setIsUserActive] = useState({})

    const toggleInvite = (id) => {
        setIsUserActive((prev) => ({
            [id]: !prev[id]
        }));
    };

    const handleOnClick = async (friend, index) => { 
       
        setCurrentChatId(friend.id)

        localStorage.setItem("currentChatId", JSON.stringify(friend.id));
        const userTalkSphereResponse = await axios.get(`http://localhost:3000/talkSphere/${userId}/${friend.id}`)
        if (userTalkSphereResponse.status === 200) {
            setUsersTemporaryChat(()=> ({
                id: userTalkSphereResponse.data.id,
                messages: []
            }))
            localStorage.setItem("talkSphereId", JSON.stringify(userTalkSphereResponse.data.id));
            setTalkSphereId(() => userTalkSphereResponse.data.id )

        }else{
            console.log(userTalkSphereResponse)
        }

        toggleInvite(index)
    }

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
                            onClick={ ()=> handleOnClick(friend, index) } 
                            />
                        ))
                    }        
        </div>
     );
}
 
export default UserBoard;