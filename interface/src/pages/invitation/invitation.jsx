import { useContext, useEffect, useState } from "react";
import { ChatBoxApiContext } from "/src/context/context";
import { useNavigate } from "react-router-dom"
import axios from "axios"
import UserInvitationCard from "/src/components/userInvitation/user.invitation.card"
import SearchBar from "/src/components/ui/searchBar/searchbar"
import SVGsendInvit from "/src/assets/svg/send-svgrepo-com.svg"
import SVGsearch from "/src/assets/svg/search-alt-2-svgrepo-com.svg"
import styles from "./invitation.module.css"

const Invitation = () => {
    const navigate = useNavigate()
    const { userId } = useContext(ChatBoxApiContext)

    
    const [userVisibleList, setUserVisbibleList] = useState([])

    const getVisibleUser = async () => {
        try{
            const response = await axios.get("http://localhost:3000/invitation/userVisible")
            setUserVisbibleList(response.data)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        if(!userId){
            navigate("/home")
        }
    }, [userId])

    useEffect(()=>{
        getVisibleUser()
    }, [])
    

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
                <div className={styles.headerRight}>
                    <div><span>Make request</span></div>
                    <div><span>See demand</span></div>
                    <div><span>Use key friend</span></div>
                </div>
            </nav>
            <div className={styles.separator} />
            <div className={styles.userInvitationCardSection}>
                {userVisibleList?.length > 0 && userVisibleList.map((user, index)=> userId!= user.id &&(
                        <UserInvitationCard
                            key= {index}
                            userId = {user.id}
                            userName={user.name}
                            userImage={user.image}
                            userAvaibility={user.avaibility}
                        />
                ))}
            </div>
        </div>
     );
}
 
export default Invitation;