import { createContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const ChatBoxApiContext = createContext();

const ChatBoxApiContextProvider = ({ children }) => {

    const [currentChatId, setCurrentChatId] = useState(
        ()=>{
            const saved = JSON.parse(localStorage.getItem("currentChatId"))
            return saved != null ? saved : null;
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
    const [usersTemporaryChat, setUsersTemporaryChat] = useState({
        id: talkSphereId,
        messages: []
    });
    const socket = useRef(null)

    const fetchUserFriend = useCallback(async () => {
        try {
            socket.current = io("http://localhost:3000")
            setLoading(true);
            const response = await axios.get("http://localhost:3000/users/13/friends");
            socket.current.emit("register", {userId: 13})
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
        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, []);

    return ( 
        <ChatBoxApiContext.Provider value={{ 
            fetchUserFriend, setTalkSphereId, setCurrentChatId,setUsersTemporaryChat,
            friends, loading, error, talkSphereId,currentChatId , usersTemporaryChat, socket
        }}
        >
                {children}
        </ChatBoxApiContext.Provider>
    );
};

export { ChatBoxApiContext, ChatBoxApiContextProvider };
