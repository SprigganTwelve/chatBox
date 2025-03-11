import axios from "axios"
import PropTypes from "prop-types"
import { useEffect, useState, useCallback, useContext } from "react";
import { ChatBoxApiContext } from "/src/context/context";
import styles from "./invitation.requests.module.css"

import isAvailableIcon from "/src/assets/svg/userIsAvailable.svg"
import isNotAvailablilityIcon from "/src/assets/svg/userIsNotAvailable.svg"

const InvitationRequests = ({ userId }) => {

    const { setPopUp } = useContext(ChatBoxApiContext)

    const [userInvitationRequest, setUserInvitationRequest] = useState([])


    const userInvitationRequestHandler = useCallback(async () => {
        try{
            const response = await axios.get(`http://localhost:3000/invitation/userInvitation/${userId}`)
            if (response.status === 200) {
                setUserInvitationRequest(response.data)
            }
        }catch(err){
            console.log("Something went wrong : ", err)
        }
    }, [userId])

    const handleConfirmInvitation = async (id) => {
        try{
            const response = await axios.post(`http://localhost:3000/invitation/confirm/`,{
                senderId: id,
                receiverId: userId, 
            })
            if (response.status === 200) {
                await userInvitationRequestHandler()
                setPopUp({ message: response.data?.message, type: "sucess"  })
            }
        }catch(err){
            console.log("Something went wrong : ", err)
        } 
    }

    useEffect(()=>{
        userInvitationRequestHandler()
    },[userInvitationRequestHandler])

    return ( 
        <div className={styles.container}>
            {
                userInvitationRequest.length > 0 ?  userInvitationRequest.map((user, key) =>
                   (
                    <div
                        key={key}
                        className={styles.userCard}
                    >
                        <div className={styles.userCardLeading}>
                            <img
                                className={styles.userImage}
                                src={`http://localhost:3000/uploads/${user.image}`}
                                alt=""
                            />
                            <div>
                                <span>{user.name}</span> 
                                <div>
                                    <img src={user?.availability  ? isAvailableIcon : isNotAvailablilityIcon } className={styles.icon}  alt="Time icon" />
                                    <p className={styles.textAboutAvailability}>{ user?.availability  ? "Available" : "Unavailable"}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            className={styles.confirmBtn}
                            onClick={()=> handleConfirmInvitation(user.id)}
                        >
                            Confirm
                        </button>
                    </div>
                   )
                ): 
                <div className={styles.message}>
                    <span>No Invitation sent yet</span>
                </div>
            }
        </div>
     );
}

InvitationRequests.propTypes = {
    userId: PropTypes.number
}

export default InvitationRequests;