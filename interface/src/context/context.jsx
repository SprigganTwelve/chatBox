import axios from "axios";
import { io } from "socket.io-client";
import React, { createContext, useState, useEffect, useCallback, useRef } from "react";

import RTCHandlers from "/src/socket/RTCHandlers/RTCHandlers.socket";
import messagesSocketHandlers from '/src/socket/messagesHandlers/message.socket.client.handlers.js'

//Import fom RTC Stream Call  component folder

import { handleShifttingAwaitingCallList } from '/src/components/ui/RTCStreamCall/handlers';

// import {} from '/src/entities/objects.of.context.js'





const ChatBoxApiContext = createContext();

const ChatBoxApiContextProvider = ({ children }) => {


    const [userId, setUserId] = useState(() => JSON.parse(localStorage.getItem("userId")) || null);
    const [talkSphereId, setTalkSphereId] = useState(() => JSON.parse(localStorage.getItem("talkSphereId")) || null);

    
    const [userData, setUserData] = useState(null);
    const [usersTemporaryChat, setUsersTemporaryChat] = useState({ id: talkSphereId, messages: [] });


    const [popUp, setPopUp] = useState(null);
    const [allChats, setAllChats] = useState([]);


    const [loading, setLoading] = useState(true);
    const [currentChat, setCurrentChat] = useState(null);


    const [fullBackgroundOpacity, setFullBackgroundOpacity] = useState(1);
    const [userChatDefaultSettings, setUserChatDefaultSettings] = useState(null);


    const [activeCall, setActiveCall] = useState({ initiate: null, currentActiveCall: null });


    const socket = useRef(null);
    const baseApiURL = useRef(import.meta.env.PROD ? import.meta.env.VITE_PROD_BASE_API_URL : `http://localhost:${import.meta.env.VITE_API_PORT}`)
    const PeerConnection = useRef({ peer: null, isAvailable: false, callOfferArray: [] });


    // Centralise l'initialisation socket in one fold

    const initializeSocket = useCallback(() => {
        
        if (!socket.current) {
            console.log("baseURl", baseApiURL.current)
            socket.current =  io(baseApiURL.current);
            socket.current.emit("register", { userId: userId.toString() });

            socket.current.messagesSocketHandlers = messagesSocketHandlers(socket.current);
            socket.current.RTCHandlers = RTCHandlers(socket.current);

            const rtcSession = PeerConnection.current;
            socket.current.on("connect", ()=>{
                rtcSession.isAvailable = true;
            })

            //  Cleanup previous to avoid duplicates

            socket.current.RTCHandlers.offOfferResponses();

            socket.current.RTCHandlers.offerResponses(({ offer, type, iceCandidateArray, senderImageData, userId }) => {
                if (rtcSession.isAvailable) {
                    console.log("Answer side", { offer, type, iceCandidateArray, senderImageData, userId })
                    setActiveCall(() => ({
                        initiate: null,
                        currentActiveCall: { userId, type, offer, iceCandidateArray, senderImageData }
                    }));
                    rtcSession.isAvailable = false;
                } else {
                    rtcSession.callOfferArray.push({ type, offer, iceCandidateArray, senderImageData, userId });
                }
            });

            socket.current.RTCHandlers.offAbortPreConnectionResponses();

            socket.current.RTCHandlers.abortPreConnectionResponses((abort) => {
                if (!abort) return;

                const { currentActiveCall, initiate } = activeCall;
                console.log("Pre abort rtc connection",{ currentActiveCall, initiate, currentChatRecivers: currentChat?.receivers.split(' ')[0] , abortUserId: abort.userId })
                
                // call receiver ( case whre the call to abort is the current one (sender or receiver) )
                if ( (currentActiveCall?.userId === abort.userId) || 
                        (initiate?.type && abort.userId.toString() === currentChat?.receivers.split(' ')[0] 
                    ) ) {
                    handleShifttingAwaitingCallList(rtcSession, setActiveCall)
                }
                else {            // call receiver (case where the call to abort is in the awaiting list ) 
                    const index = rtcSession.callOfferArray.findIndex( o => o.userId === abort.userId );
                    if (index !== -1) {
                        rtcSession.callOfferArray.splice(index, 1);
                        return
                    }
                }

            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, activeCall]);


    //  Initialisation data


    const fetchInitialData = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            initializeSocket();

            const [userRes, chatRes] = await Promise.all([
                axios.get(`${baseApiURL.current}/users/${userId}`),
                axios.get(`${baseApiURL.current}/talkSphere/${userId}`)
            ]);

            const {
                full, theme, dialect, opacity, fontsize, settings_id,
                typing_indicator, auto_delete_messages, read_receipts,
                sound_notification, desktop_notification, mention_notification
            } = userRes.data;

            setUserData(userRes.data);
            setAllChats(chatRes.data);
            setUserChatDefaultSettings({
                full, theme, dialect, opacity, fontsize, settings_id,
                read_receipts, typing_indicator, sound_notification,
                auto_delete_messages, desktop_notification, mention_notification
            });

            if (full) setFullBackgroundOpacity(0.5);
        }
        catch (err) {
            console.error(err);
            setPopUp({ message: "Something went wrong while initializing", type: "error" });
        }
        finally {
            setLoading(false);
        }

    }, [userId, initializeSocket]);



    useEffect(() => {
        if (userId) {
            fetchInitialData();
        }

        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, [fetchInitialData, userId]);



    return (
        <ChatBoxApiContext.Provider value={{
            fetchInitialData, setTalkSphereId, setPopUp, setUsersTemporaryChat,
            setUserId, setUserData, setCurrentChat, setActiveCall,
            allChats, loading, popUp, talkSphereId, usersTemporaryChat,
            socket, PeerConnection, userId, userData, userChatDefaultSettings,
            fullBackgroundOpacity, currentChat, activeCall, baseApiURL
        }}>
            {children}
        </ChatBoxApiContext.Provider>
    );
};


ChatBoxApiContextProvider.propTypes = {
    children: React.Children
}



export { ChatBoxApiContext, ChatBoxApiContextProvider };
