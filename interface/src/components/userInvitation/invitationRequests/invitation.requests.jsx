import axios from "axios"
import PropTypes from "prop-types"
import { useEffect, useState, useCallback } from "react";

import styles from "./invitation.requests.module.css"

import isAvailableIcon from "/src/assets/svg/userIsAvailable.svg"
import isNotAvailablilityIcon from "/src/assets/svg/userIsNotAvailable.svg"

const InvitationRequests = ({ userId, setPopUp, baseApiURL, }) => {

    const [userInvitationRequest, setUserInvitationRequest] = useState([])

    //Handle the getting
    const userInvitationRequestHandler = useCallback(async () => {
        try{
            const response = await axios.get(`${baseApiURL.current}/invitation/userInvitation/${userId}`)
            if (response.status === 200) {
                setUserInvitationRequest(response.data)
            }
        }catch(err){
            console.log("Something went wrong : ", err)
        }
    }, [userId])

    //handle the confirmation 
    const handleConfirmInvitation = async (id) => {
        try{
            const response = await axios.post(`${baseApiURL.current}/invitation/confirm/`,{
                senderId: id,
                receiverId: userId, 
            })
            if (response.status === 200) {
                setUserInvitationRequest(prevRequests => 
                    prevRequests.filter(request => request.id !== id)
                );
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
                                src={`${baseApiURL.current}/uploads/users/${user.folder}/parameters/${user.image}`}
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