
import { Outlet, useLocation } from 'react-router-dom';
import { ChatBoxApiContext } from '/src/context/context';

import PopUp from "/src/components/ui/popUp/pop.up"
import Modal from "/src/components/ui/modal/modal"
import SideBarMenu from '/src/components/ui/sideBarMenu/sidebar.menu';
import RTCStreamCall from '/src/components/ui/RTCStreamCall/RTC.stream.call';

import styles from "./layout.module.css" 
import { useContext } from 'react';


const Layout = () => {

    const location = useLocation()
    const { activeCall } = useContext(ChatBoxApiContext)

    return ( 
        <div className={styles.layoutContainer}>
            {  
                !(activeCall && activeCall.initiate) && location.pathname !== '/' && (
                    <SideBarMenu/>
            )}
            <Outlet />
            <PopUp />
            {
                activeCall && 
                    ( activeCall.initiate || (
                        activeCall.currentActiveCall
                    )) ? (
                        <Modal
                            styleContent = { { background: 'transparent' } }
                            open={ true }
                        >
                            <RTCStreamCall 
                                defaultMode= {  
                                    activeCall.initiate ? 
                                        activeCall.initiate.type 
                                        : activeCall.currentActiveCall ?
                                                activeCall.currentActiveCall.type
                                            : ""
                                }
                            />
                        </Modal>
                    )
                    :<></>
            }

        </div>
    );
}
 
export default Layout;