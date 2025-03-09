
import { useContext, useEffect, useState } from "react";
import { ChatBoxApiContext } from "/src/context/context";
import { useNavigate } from "react-router-dom"
import clsx from "clsx"

import UserInvitationCard from "/src/components/userInvitation/userInvitationCard/user.invitation.card"
import InvitationRequests from "/src/components/userInvitation/invitationRequests/invitation.requests"
import SearchBar from "/src/components/ui/searchBar/searchbar"
import SVGsendInvit from "/src/assets/svg/send-svgrepo-com.svg"
import SVGsearch from "/src/assets/svg/search-alt-2-svgrepo-com.svg"
import styles from "./invitation.module.css"

const Invitation = () => {
    const navigate = useNavigate()
    const { userId } = useContext(ChatBoxApiContext)

    const [ isActive, setIsActive ] = useState(1);

    useEffect(()=>{
        if(!userId){
            navigate("/home")
        }
    }, [userId])


    return ( 
        <div className={styles.container}>
            <nav className={styles.navBarContainer}>
                <div className={styles.headerLeft}>
                    <div>
                            <span className={styles.title}>Invitation</span>
                            <img src={SVGsendInvit} className={styles.networkIcon} alt="" />
                    </div>
                    <div>
                        <SearchBar width={400} backgroundColor="rgb(122, 119, 119)" />
                        <img src={SVGsearch} className={styles.serchIcon} alt="" />
                    </div>
                </div>
                <div
                    className={styles.headerRight}
                >
                    <div
                        className={clsx(styles.headerRight, isActive==1 && styles.isActive)}
                        onClick={() => setIsActive(1)}
                    >
                        <span>Make request</span>
                    </div>
                    <div
                        className={clsx(styles.headerRight, isActive==2 && styles.isActive)}
                        onClick={() => setIsActive(2)}
                    >
                        <span>See demand</span>
                    </div>
                    <div
                        className={clsx(styles.headerRight, isActive==3 && styles.isActive)}
                        onClick={() => setIsActive(3)}
                    >
                        <span >Use key friend</span>
                    </div>
                </div>
            </nav>
            <div className={styles.separator} />
            <div className={styles.userInvitationCardSection}>
                { isActive == 1 && 
                            <UserInvitationCard userId={userId}/>
                }

                {
                   isActive == 2 &&  <InvitationRequests userId={userId} />
                }
            </div>
        </div>
     );
}
 
export default Invitation;