import { Outlet, useLocation } from 'react-router-dom';
import SideBarMenu from '/src/components/ui/sideBarMenu/sidebar.menu';
import styles from "./layout.module.css"

const Layout = () => {
    const location = useLocation()
    return ( 
        <div className={styles.layoutContainer}>
            {location.pathname !== '/' && <SideBarMenu/> }
            <Outlet />
        </div>
    );
}
 
export default Layout;