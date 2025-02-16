import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const ChatBoxApiContext = createContext();

const ChatBoxApiContextProvider = ({ children }) => {

    const [currentChatId, setCurrentChatId] = useState(
        ()=>{
            const saved = JSON.parse(localStorage.getItem("currentChatId"))
            return saved != null ? saved : 0;
        }
    )
    const [talkSphereId, setTalkSphereId] = useState(
        ()=>{
            const saved = JSON.parse(localStorage.getItem("talkSphereId"))
            return saved != null ? saved : null;
    }
    );

    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    const fetchUserFriend = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:3000/users/13/friends");
            setFriends(response.data); 
        } catch (err) {
            setError(err.message); 
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (friends.length === 0) { 
            fetchUserFriend();
        }
    }, []);

    return ( 
        <ChatBoxApiContext.Provider value={{ 
            fetchUserFriend, setTalkSphereId, setCurrentChatId,
            friends, loading, error, talkSphereId,currentChatId
        }}
        >
                {children}
        </ChatBoxApiContext.Provider>
    );
};

export { ChatBoxApiContext, ChatBoxApiContextProvider };
