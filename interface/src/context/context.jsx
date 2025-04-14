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
            return saved != null && saved!= undefined ? saved : null;
        }
    )
    const [talkSphereId, setTalkSphereId] = useState(
        ()=>{
            const saved = JSON.parse(localStorage.getItem("talkSphereId"))
            return saved != null && saved != undefined ? saved : null;
    }
    );

    const [fullBackgroundOpacity, setFullBackgroundOpacity] = useState(1)


    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [popUp, setPopUp] = useState(null); 
    const [modal, setModal] = useState(null);
    const [userChatDefaultSettings, setUserChatDefaultSettings] = useState(null);
    
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
                socket.current.emit("register", {userId: userId.toString()})
                
                const {
                    full,
                    theme,
                    dialect,
                    opacity,
                    fontsize,
                    settings_id,
                    typing_indicator,
                    auto_delete_messages,
                    read_receipts,
                    sound_notification,
                    desktop_notification,
                    mention_notification,
                    }  = requestForUserData.data;

                setUserData(requestForUserData.data)
                setFriends(requestForFriendship.data);
                setUserChatDefaultSettings(
                    {
                        full,
                        theme,
                        dialect,
                        opacity,
                        fontsize,
                        settings_id,
                        typing_indicator,
                        auto_delete_messages,
                        read_receipts,
                        sound_notification,
                        desktop_notification,
                        mention_notification,
                    }
                )
                if(full) setFullBackgroundOpacity(0.5)
            } catch (err) {
                setPopUp({ message: "Something went wrong while retreiving user data", type: "error" }
                );
                console.log(err) 
            } finally {
                setLoading(false);
            }
        }
        return () => socket.current.disconnect();
    }, [userId, socket]);



    useEffect(() => {
        if (friends.length === 0) { 
            fetchUserFriend();
        }
        return () => {
            if (socket.current) {
                socket.current.off("register")
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, []);



    return ( 
        <ChatBoxApiContext.Provider value={{ 
            fetchUserFriend, setTalkSphereId, setPopUp, setModal, setCurrentChatId,setUsersTemporaryChat, setUserId, setUserData,
            friends, loading, popUp, modal, talkSphereId, currentChatId , usersTemporaryChat, socket, userId, userData, userChatDefaultSettings, fullBackgroundOpacity
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
