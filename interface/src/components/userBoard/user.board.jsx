import { useCallback, useContext, useState } from "react";
import { ChatBoxApiContext } from "../../context/context"
import MessageCard from "./components/userCard/user.card";
import SearchBar from "/src/components/ui/searchBar/searchbar"

import SVGbox from "/src/assets/svg/box-svgrepo-com.svg"
import styles from "./user.board.module.css"

const UserBoard = () => {

    const [isUserActive, setIsUserActive] = useState({})
    const { allChats, setTalkSphereId, setUsersTemporaryChat , fullBackgroundOpacity } = useContext(ChatBoxApiContext)


    const toggleInvite = useCallback((id) => {
        setIsUserActive((prev) => ({
            [id]: !prev[id]
        }));
    }, [])

    const handleOnClick = useCallback(async (chat, index) => { 
       
        if(!chat.id) return;
        setUsersTemporaryChat(()=> ({
            id: chat.id,
            messages: []
        }))
        localStorage.setItem("talkSphereId", JSON.stringify(chat.id));

        console.log("chat", chat)

        setTalkSphereId( () => chat.id )
        toggleInvite( index ) //Mark the card as active

    },[setTalkSphereId, setUsersTemporaryChat, toggleInvite])


    return (
        <div  
            className={styles.container}
            style={{
                 "--opacityBackground": fullBackgroundOpacity
            }}
        >
            <div className={styles.title}>
                <img src={SVGbox} width={30} alt="" />
                ChatBox
            </div>
            <SearchBar
                backgroundColor = { `rgb(67, 65, 65, ${fullBackgroundOpacity})` }
            />
            { allChats.map((chat, index)=>{
                        const imageData = typeof chat.image_data === "string"
                        ? JSON.parse(chat.image_data)
                        : chat.image_data;
                   
                        return(
                            <MessageCard  
                                key={ index }
                                url={  `http://localhost:3000/uploads/users/${imageData.folder}/parameters/${imageData.image}`  }
                                online={ false }
                                name={ chat.name }
                                isActive={isUserActive[index]}
                                onClick={ ()=> handleOnClick(chat, index) }
                                style={{
                                    "--backGroundOpacity": fullBackgroundOpacity
                                }}
                            />
                        )
                    })
            }        
        </div>
     );
}
 
export default UserBoard;