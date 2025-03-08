import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const ChatBoxApiContext = createContext();

const ChatBoxApiContextProvider = ({ children }) => {

    const [userId, setUserId] = useState(()=>{
        const saved = JSON.parse(localStorage.getItem("userId"))
        return saved != null ? saved : null;
    })

    const [userData, setUserData] = useState(null)

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
    const [modal, setModal] = useState(null);
    
    const [usersTemporaryChat, setUsersTemporaryChat] = useState({
        id: talkSphereId,
        messages: []
    });
    const socket = useRef(null)

    const fetchUserFriend = useCallback(async () => {
        if(userId){
            try {
                setLoading(true);

                socket.current = io("http://localhost:3000")
                const requestForUserData = await axios.get(`http://localhost:3000/users/${userId}`)
                const requestForFriendship = await axios.get(`http://localhost:3000/users/${userId}/friends`);
                socket.current.emit("register", {userId: userId})

                setUserData(requestForUserData.data)
                setFriends(requestForFriendship.data); 
            } catch (err) {
                setError("Something went wrong while retreiving unser data");
                console.log(err) 
            } finally {
                setLoading(false);
            }
        }
    }, [userId]);

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
            fetchUserFriend, setTalkSphereId, setError, setModal, setCurrentChatId,setUsersTemporaryChat, setUserId,
            friends, loading, error, modal, talkSphereId, currentChatId , usersTemporaryChat, socket, userId, userData
        }}
        >
                {children}
        </ChatBoxApiContext.Provider>
    );
};

ChatBoxApiContextProvider.propTypes = {
    children: React.Children
}

export { ChatBoxApiContext, ChatBoxApiContextProvider };
