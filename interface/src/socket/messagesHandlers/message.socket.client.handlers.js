
const messagesSocketHandlers = (socket) => {

    //Here we make a join request to the server 

    const joinRoomRequest = (room) =>{
        socket.emit("JoinRoom", room  )
    }

    const joinRoomResponse = (callback)=>{
        socket.on("joinRoomResponse", ({ state })=>{
            if(callback) callback(state)
        })
    }

    const offJoinRoomResponse = () => socket.off("JoinRoom")

    const leaveRoom = (room)=> {
        socket.emit("leaveRoom", room)
    }

    const sendMessageRequest = ({ senderId, talkSphereId, content, createdAt }) => {
        console.log({ senderId, talkSphereId, content, createdAt })
        socket.emit("privateMessage", { senderId, talkSphereId, content, createdAt })
    }

    //Here we listen all the incomming message through one specific room (talksphereId)

    const newMessagesResponses = (callback)=>{
        socket.on("newMessage", (message)=> {
            if(message) callback(message)
        })
    }

    const offNewMessageResponses = ()=>{
        socket.off("newMessage")
    }

    //GB, Here we listen all the incoming message for handle the notifications through the socketId

    const captureIncommingMessageResponse = ()=> {

    }

    const offCaptureIncommingMessageResponse = ()=> {

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
        offJoinRoomResponse,

        sendMessageRequest,
        newMessagesResponses,
        offNewMessageResponses,

        captureIncommingMessageResponse,
        offCaptureIncommingMessageResponse,

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


