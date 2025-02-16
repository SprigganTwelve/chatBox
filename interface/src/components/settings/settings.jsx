
import SVGsettings from "/src/assets/svg/settings-gear-svgrepo-com.svg"
import styles from "./settings.module.css"

const Settings = () => {
    return ( 
        <img src={SVGsettings}  className={styles.icon} />
     );
}
 
export default Settings;