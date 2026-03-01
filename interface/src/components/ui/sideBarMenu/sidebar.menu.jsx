
import clsx from 'clsx';
import { useCallback, useContext, useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"

import { ChatBoxApiContext } from "/src/context/context"
import { SideBarContext } from "/src/context/sidebar.context"

import SVGmessage from "/src/assets/svg/message-square-list-svgrepo-com.svg"
import SVGinvit from "/src/assets/svg/invitation-svgrepo-com.svg"
import SVGstatus from  "/src/assets/svg/status2-svgrepo-com.svg"
import SVGburger from  "/src/assets/svg/hamburger-menu-more-svgrepo-com.svg"
import SVGclose from '/src/assets/svg/close-circle-svgrepo-com.svg'
import SVGbox from "/src/assets/svg/box-svgrepo-com.svg"

import AboutOverlay from "/src/components/ui/aboutOverlay/about.overlay";

import { CHAT_HEADER_HEIGHT } from "/src/components/chatBoard/components/chatHeader/chat.header";

import styles from "./sidebar.menu.module.css"




const SideBarMenu = ({baseApiURL}) => {

    const navigate = useNavigate()
    
    const { userData, fullBackgroundOpacity } = useContext(ChatBoxApiContext)
    const { breakPoint, setIsUserPanelVisibleOnMobile  } = useContext(SideBarContext)

    const [ showDropdown, setShowDropdown ] = useState(false)            // dropdown for responsive design
    const [ showBurgerMenu, setShowBurgerMenu ] = useState(false)       //  dropdown 

    const [ isActive, setIsActive ] = useState(()=>{
        const saved = JSON.parse(localStorage.getItem("menu"))
        return saved ?? "message"
    })


    const handleChangeActiveMenu = useCallback((menu, route) => {
            setIsActive(menu)
            navigate(route)
            localStorage.setItem("menu", JSON.stringify(menu))
            window.location.reload()
    }, [setIsActive, navigate])


    const loadAndResizehandler = useCallback(() => {
        if (breakPoint) {
            setShowBurgerMenu(true);
        }
        else{
            setShowBurgerMenu(false)
        }
    },[setShowBurgerMenu, breakPoint]);


    useEffect(() => {
        loadAndResizehandler()
    }, [loadAndResizehandler]);



    return ( 
        <> 
            {
                !showBurgerMenu ?
                    <div className={styles.container}>
                        <div className={styles.menu}>
                            <AboutOverlay text="Message">
                                <img 
                                    alt="message"
                                    src={SVGmessage}
                                    onClick={()=> handleChangeActiveMenu("message", "/home")}
                                    className={clsx(styles.img,isActive === "message" ? styles.isActive : "")}
                                    style={{
                                        "--backGroundOpacity": fullBackgroundOpacity
                                    }}
                                />
                            </AboutOverlay>
                            <AboutOverlay text = "Invitation">
                                <img
                                    src={SVGinvit}
                                    alt="invitation"
                                    onClick={()=> handleChangeActiveMenu("invit","/invitation") }
                                    className={clsx(styles.img,isActive === "invit" ? styles.isActive : "")}
                                    style={{
                                        "--backGroundOpacity": fullBackgroundOpacity
                                    }}
                                />
                            </AboutOverlay>
                            <AboutOverlay text="Status">
                                <img 
                                    alt="status"
                                    src={SVGstatus}
                                    onClick={()=> handleChangeActiveMenu("status","/status") }
                                    className={clsx(styles.img, isActive === "status" ? styles.isActive : "")}
                                    style={{
                                        "--backGroundOpacity": fullBackgroundOpacity
                                    }}
                                />
                            </AboutOverlay>
                        </div>
                        <div className={styles.profilSection}>
                                <AboutOverlay 
                                    text="Profil"
                                >
                                    <img
                                        alt="profil"
                                        className={ styles.profilImage }
                                        onClick={()=> handleChangeActiveMenu("", "/profil")}
                                        src= { 
                                            userData?.image
                                            ? (userData.image.startsWith("blob") 
                                                ? userData.image 
                                                : `${baseApiURL.current}/uploads/users/${ userData.folder }/parameters/`+ userData.image.trim() )
                                            : "/image/randomUser.png"
                                        }
                                    />
                                </AboutOverlay>
                        </div>
                    </div>
                :   
                    <div>
                        <div 
                            className={ styles.burgerMenuContainer }
                            style = {{ top: (CHAT_HEADER_HEIGHT/2) + "px" }}
                            onClick={ ()=> setShowDropdown(prev => (!prev)) }
                        >
                            <img className={styles.burgerImg} src={SVGburger} alt="Menu" />
                        </div>
                        {
                            showBurgerMenu && showDropdown ? (
                                <div className={styles.dropdown}>

                                        <img 
                                            alt="close"
                                            src={SVGclose}
                                            className={clsx(styles.img, styles.closeDropdownIcon)}
                                            onClick={()=> setShowDropdown((prev)=>!prev)}
                                        />
                                        <div
                                            className={styles.dropdownProfilConatiner}
                                            onClick={()=> handleChangeActiveMenu("", "/profil")}
                                        >
                                            <img 
                                                alt="profil"
                                                src= { 
                                                    userData?.image
                                                    ? (userData.image.startsWith("blob") 
                                                        ? userData.image 
                                                        : `${baseApiURL.current}/uploads/users/${ userData.folder }/parameters/`+ userData.image.trim() )
                                                    : "/image/randomUser.png"
                                                }
                                            />
                                            <div>
                                                <p>{userData?.name}</p>
                                                {userData?.pseudo !="..." && <p className={styles.pseudo}>{ userData?.pseudo }</p> }
                                            </div>
                                        </div>
                                        
                                        <div className={styles.dropdownControlBox}>
                                                
                                            <div className={styles.desc}>
                                                <div>
                                                    <img src={SVGbox} alt="box" />
                                                    <span>chatBox</span>
                                                </div>
                                                <p>
                                                    Un espace calme pour parler librement.
                                                    Des mots, des sourires et un peu de magie.
                                                    Reste toi-même, discute sans pression.
                                                    Ta zone de confort numérique.
                                                </p>
                                            </div>

                                            <menu>
                                                <li 
                                                    onClick={ ()=> {
                                                        setIsUserPanelVisibleOnMobile((prev)=> ! prev)
                                                    } }
                                                >
                                                    <img 
                                                        alt="message"
                                                        src={SVGmessage}
                                                        className={styles.img}
                                                        style={{
                                                            "--backGroundOpacity": fullBackgroundOpacity
                                                        }}
                                                    />
                                                    <span>Message</span>
                                                </li>
                                                <li 
                                                    onClick={()=> handleChangeActiveMenu("invit","/invitation") }
                                                >
                                                    <img
                                                        src={SVGinvit}
                                                        alt="invitation"
                                                        className={styles.img}
                                                        style={{
                                                            "--backGroundOpacity": fullBackgroundOpacity
                                                        }}
                                                    />
                                                    <span>Invitation</span>
                                                </li>
                                                <li
                                                    onClick={()=> handleChangeActiveMenu("status","/status") }
                                                >
                                                    <img 
                                                        alt="status"
                                                        src={SVGstatus}
                                                        
                                                        className={styles.img}
                                                        style={{
                                                            "--backGroundOpacity": fullBackgroundOpacity
                                                        }}
                                                    />
                                                    Status
                                                </li>
                                            </menu>

                                        </div>

                                </div>
                            ) : <></>
                        }
                    </div>
            }
        </>
    );
}
 
export default SideBarMenu;