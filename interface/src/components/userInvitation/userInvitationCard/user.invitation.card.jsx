import axios from "axios"
import PropTypes  from "prop-types"
import { useState, useEffect, useCallback, useContext } from "react"
import { ChatBoxApiContext } from "/src/context/context";

import styles from "./user.invitaion.card.module.css"
import isAvailableIcon from "/src/assets/svg/userIsAvailable.svg"
import isNotAvailablilityIcon from "/src/assets/svg/userIsNotAvailable.svg"

const UserInvitationCard = ({userId , setPopUp, baseApiURL}) => {

    const { setPopUp } = useContext(ChatBoxApiContext)

    const [userVisibleList, setUserVisbibleList] = useState([])
    const [invitedUsers, setInvitedUsers] = useState({})

    const toggleInvite = (id) => {
        setInvitedUsers((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };


    const handleSendInvitation = async (data) => {
        try{
            const response = await axios.post(`${baseApiURL.current}/invitation/userAssocRequest`, data)
            setPopUp({ message: response.data?.message, type: "sucess"  })
        }
        catch(err){
            console.log("something went wrong: ", err)
        }
    }

    const getVisibleUser = useCallback(async () => {
        try{
            if (userId) {
                const response = await axios.get(`${baseApiURL.current}/invitation/userVisible/${userId}`)
                setUserVisbibleList(response.data)
                console.log(response)
            }
        }catch(error){
            console.log(error)
        }
    }, [userId])

    useEffect(()=>{
        getVisibleUser()
    }, [getVisibleUser])

    return ( 
        <div className={styles.main}>
            {
                userVisibleList.length > 0 && userVisibleList.map((user, key)=>{
                        if(user.id != userId){
                            return (
                                <div
                                    key={key}
                                    className={styles.container}
                                >
                                    <img 
                                        src={ user.image ? 
                                            `${baseApiURL.current}/uploads/users/${user.folder}/parameters/` + user.image 
                                            : "/image/randomUser.png"
                                        }
                                        className={styles.profilImage}
                                        alt="userImage"
                                    />
                                    <div className={styles.textSection}>
                                        <span className={styles.userName}>{user.name}</span>
                                        <div>
                                            <img src={user?.availability  ? isAvailableIcon : isNotAvailablilityIcon } className={styles.icon}  alt="Time icon" />
                                            <span className={styles.textAboutAvailability}>{ user?.availability  ? "Available" : "Unavailable"}</span>
                                        </div>
                                        <button 
                                            className={styles.invitButton}
                                            style={{color: invitedUsers[key]  ? "#EEE4B1": "white"}}
                                            onClick={()=>{
                                                toggleInvite(key)
                                                if (!invitedUsers[key]) {
                                                    handleSendInvitation(
                                                        {
                                                            senderId: userId,
                                                            receiverId: user.id,
                                                        }
                                                    )
                                                }
                                                else{
                                                    //TODO: implement
                                                }
                                            }}
                                        >
                                            {invitedUsers[key] ? "Cancel": "Invit"}
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                        else{
                            return null
                        }
                })
            }
        </div>
     );
}

UserInvitationCard.propTypes = {
    userId: PropTypes.number
}

export default UserInvitationCard;