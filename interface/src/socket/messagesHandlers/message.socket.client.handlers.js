
const messagesSocketHandlers = (socket) => {

    const joinRoomRequest = () =>{
        //TODO: IMPLEMENT
    }

    const joinRoomResponse = ()=>{
        //TODO: IMPLEMENT
    }

    const leaveRoom = ()=> {
        //TODO: IMPLEMENT
    }

    const sendMessageRequest = ({userId, currentChatId, talkSphereId, value, createdAt}) => {
        socket.emit("privateMessage", { senderId: userId, receiverId: currentChatId , talkSphereId, content: value, createdAt })
    }

    const newMessagesResponses = ()=>{
        //TODO: IMPLEMENT
    }

    const offNewMessageResponses = ()=>{
        //TODO: IMPLEMENT
    }

    const writtingRequest = ()=>{
        //TODO: IMPLEMENT
    }

    const writtingResponse = ()=>{
        //TODO: IMPLEMENT
    }

    const offWrittingResponses = () => {
        //TODO: IMPLEMENT
    }

    //Notify that the user has seen a specific message
    const  pushViewedMessagesRequest = () => {

    }

    const pushViewedMessagesResponses = ()=> {

    }

    const offPushViewedMessagesRequest = () => {

    }

    //Here we request the loading of the older/ancient messages
    const loadOlderMessageRequest = ()=>{

    }

    const loadOlderMessageResponses = () => {

    }

    const offLoadOlderMessageResponses = ()=> {

    }

    return {
        
        leaveRoom,
        joinRoomRequest,
        joinRoomResponse,

        sendMessageRequest,
        newMessagesResponses,
        offNewMessageResponses,

        writtingRequest,
        writtingResponse,
        offWrittingResponses,

        pushViewedMessagesRequest,
        pushViewedMessagesResponses,
        offPushViewedMessagesRequest,

        loadOlderMessageRequest,
        loadOlderMessageResponses,
        offLoadOlderMessageResponses

    }
}


export default messagesSocketHandlers


