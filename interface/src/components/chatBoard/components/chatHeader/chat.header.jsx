import axios from "axios";
import { useEffect, useState } from "react";

const ChatHeader = ({
    currentChatId
}) => {

    const [user, setUser] = useState({})

    async function fetchUser(){
        return await axios.get(`http://localhost:3000/users/${currentChatId}`)
    }

    useEffect(()=>{
        const specificUser = fetchUser();
        setUser(specificUser.data);
        console.log(specificUser.data)
    }, [])

    return ( 
        <>
            {
                user && (
                    <div>
                        <img src={user.image} alt="profil" />
                        <span>{user.name}</span>
                        
                        {/* TODO: Menu  for parameter*/}
                    </div>
                )
            }
        </>
     );
}
 
export default ChatHeader;