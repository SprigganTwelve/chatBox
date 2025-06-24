import axios from "axios";
import { io } from "socket.io-client";
import React, { createContext, useState, useEffect, useCallback, useRef } from "react";

import RTCHandlers from "/src/socket/RTCHandlers/RTCHandlers.socket";
import messagesSocketHandlers from '/src/socket/messagesHandlers/message.socket.client.handlers.js'

// import {} from '/src/entities/objects.of.context.js'



const ChatBoxApiContext = createContext();

const ChatBoxApiContextProvider = ({ children }) => {


    const [userId, setUserId] = useState(()=>{
        const saved = JSON.parse(localStorage.getItem("userId"))
        return saved != null ? saved : null;
    })

    const [ userData, setUserData ] = useState(null)


    const [talkSphereId, setTalkSphereId] = useState(
        ()=>{
            const saved = JSON.parse(localStorage.getItem("talkSphereId"))
            return saved != null && saved != undefined ? saved : null;
    }
    );

    const [usersTemporaryChat, setUsersTemporaryChat] = useState({
        id: talkSphereId,
        messages: []
    });

    const [fullBackgroundOpacity, setFullBackgroundOpacity] = useState(1)


    const [ popUp, setPopUp ] = useState(null); 
    const [ allChats, setAllChats ] = useState([]);
    const [ loading, setLoading ] = useState(true); 
    const [ currentChat, setCurrentChat ] = useState(null)
    const [ userChatDefaultSettings, setUserChatDefaultSettings ] = useState(null);

    const [ activeCall, setActiveCall ] = useState({ 
        initiate: null,
        currentActiveCall: null
    })



    const socket = useRef(null)
    const PeerConnection  = useRef({ peer: null, isAvailable: true , callOfferArray: [] })



    const fetchChatsFromBdd = useCallback(async () => {
        if(userId){
            try {
                setLoading(true);
                

                //--- Socket

                socket.current = io(`http://localhost:${import.meta.env.VITE_API_PORT}`)
                socket.current.emit("register", { userId: userId.toString() })
                socket.current.messagesSocketHandlers = messagesSocketHandlers(socket.current)
                socket.current.RTCHandlers = RTCHandlers(socket.current)

                //---WebRTC
                    //----dealing with offers

                const rtcSession = PeerConnection.current

                socket.current.RTCHandlers.offerResponses(async ({ offer, type, iceCandidateArray, senderImageData , userId})=>{
                    if( rtcSession.isAvailable ){
                        rtcSession.isAvailable = false
                        setActiveCall( ()=>({ 
                            initiate: null,
                            currentActiveCall: { userId, type, offer, iceCandidateArray , senderImageData }
                        }) )
                    }
                    else{
                        rtcSession.callOfferArray.push( { type, offer, iceCandidateArray , senderImageData } )
                    }
                })

                    //---abort session that has been rejected and where connection state never change to connected

                socket.current.RTCHandlers.abortPreConnectionResponses(({userId})=>{
                    console.log("abortPreConnection", { userId })
                    if(userId){
                        if(rtcSession.callOfferArray && rtcSession.callOfferArray.length > 0){
                            const index = rtcSession.callOfferArray.findIndex((offer)=> offer.userId.toString() === userId.toString())
                            if(index !== -1){
                                rtcSession.callOfferArray.splice(index, 1)
                            }
                            setActiveCall(()=>({ initiate: null, currentActiveCall: rtcSession.callOfferArray[0] }))
                            rtcSession.callOfferArray.splice( 0, 1 )
                            return

                        }
                        setActiveCall(()=>({ initiate: null, currentActiveCall: null }))
                    }
                })

                //-----

                const requestForUserData = await axios.get(`http://localhost:${import.meta.env.VITE_API_PORT}/users/${userId}`)
                const requestForChats = await axios.get(`http://localhost:${import.meta.env.VITE_API_PORT}/talkSphere/${userId}`);
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
                setUserChatDefaultSettings( () => (
                    {
                        full,
                        theme,
                        dialect,
                        opacity,
                        fontsize,
                        settings_id,
                        read_receipts,
                        typing_indicator,
                        sound_notification,
                        auto_delete_messages,
                        desktop_notification,
                        mention_notification,
                    })
                )
                if(full) setFullBackgroundOpacity(0.5)
            }
            catch (err) {
                setPopUp({ message: "Something went wrong while initializing", type: "error" }
                );
                console.log(err) 
            } 
            finally {
                setLoading(false);
            }
        }
        return () => socket.current.disconnect();
    }, [userId, socket]);



    useEffect(() => {
        fetchChatsFromBdd();
        return () => {
            if (socket.current) {
                socket.current.off("register")
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, [fetchChatsFromBdd]);



    return ( 
        <ChatBoxApiContext.Provider value={{ 
            fetchChatsFromBdd, setTalkSphereId, setPopUp,  setUsersTemporaryChat, setUserId, setUserData,setCurrentChat , setActiveCall,
            allChats, loading, popUp, talkSphereId , usersTemporaryChat, socket, PeerConnection, userId, userData, userChatDefaultSettings, fullBackgroundOpacity,
            currentChat, activeCall
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
