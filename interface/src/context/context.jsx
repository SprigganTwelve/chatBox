import { io } from "socket.io-client";
import axios from "axios";
import React, { createContext, useState, useEffect, useCallback, useRef } from "react";

import messagesSocketHandlers from '/src/socket/messagesHandlers/message.socket.client.handlers.js'


const ChatBoxApiContext = createContext();

const ChatBoxApiContextProvider = ({ children }) => {


    const [userId, setUserId] = useState(()=>{
        const saved = JSON.parse(localStorage.getItem("userId"))
        return saved != null ? saved : null;
    })

    const [userData, setUserData] = useState(null)


    const [talkSphereId, setTalkSphereId] = useState(
        ()=>{
            const saved = JSON.parse(localStorage.getItem("talkSphereId"))
            return saved != null && saved != undefined ? saved : null;
    }
    );

    const [fullBackgroundOpacity, setFullBackgroundOpacity] = useState(1)


    const [ popUp, setPopUp ] = useState(null); 
    const [ modal, setModal ] = useState(null);
    const [ allChats, setAllChats ] = useState([]);
    const [ loading, setLoading ] = useState(true); 
    const [ userChatDefaultSettings, setUserChatDefaultSettings ] = useState(null);
    
    const [usersTemporaryChat, setUsersTemporaryChat] = useState({
        id: talkSphereId,
        messages: []
    });
    const socket = useRef(null)



    const fetchChatsFromBdd = useCallback(async () => {
        if(userId){
            try {
                setLoading(true);

                socket.current = io("http://localhost:3000")
                socket.current.emit("register", {userId: userId.toString()})
                socket.current.messagesSocketHandlers = messagesSocketHandlers(socket.current)

                const requestForUserData = await axios.get(`http://localhost:3000/users/${userId}`)
                const requestForChats = await axios.get(`http://localhost:3000/talkSphere/${userId}`);
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
                setAllChats(requestForChats.data);
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
        if (allChats.length === 0) { 
            fetchChatsFromBdd();
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
            fetchChatsFromBdd, setTalkSphereId, setPopUp, setModal, setUsersTemporaryChat, setUserId, setUserData,
            allChats, loading, popUp, modal, talkSphereId , usersTemporaryChat, socket, userId, userData, userChatDefaultSettings, fullBackgroundOpacity
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
