import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const ChatBoxApiContext = createContext();

const ChatBoxApiContextProvider = ({ children }) => {
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem("users"); 
        return savedUsers ? JSON.parse(savedUsers) : []; 
    });
    const [currentChatId, setCurrentChatId] = useState(()=>{
        const savedId = localStorage.getItem('currentChatId')
        return savedId ? JSON.parse(savedId) : 0;
    })
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    const fetchUsersAll = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:3000/users");
            setUsers(response.data); 
            localStorage.setItem("users", JSON.stringify(response.data)); 
        } catch (err) {
            setError(err.message); 
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (users.length === 0) { 
            fetchUsersAll();
        }
    }, []);

    return ( 
        <ChatBoxApiContext.Provider value={{ 
            users, loading, error, 
            fetchUsersAll, setCurrentChatId, currentChatId }}
        >
                {children}
        </ChatBoxApiContext.Provider>
    );
};

export { ChatBoxApiContext, ChatBoxApiContextProvider };
