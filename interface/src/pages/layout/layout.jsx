import { Outlet, useLocation } from 'react-router-dom';
import ErrorBox from "/src/components/ui/errorBox/error.box"
import SideBarMenu from '/src/components/ui/sideBarMenu/sidebar.menu';
import styles from "./layout.module.css"

const Layout = () => {
    const location = useLocation()
    return ( 
        <div className={styles.layoutContainer}>
            {location.pathname !== '/' && <SideBarMenu/> }
            <Outlet />
            <ErrorBox />
        </div>
    );
}
 
export default Layout;