

import ViewOption from "/src/components/ui/viewOption/view.option";
import Switch from "/src/components/ui/switch/switch"

import styles from "./notification.settings.module.css"

const NotificationSettings = () => {
    return (
    <div className={styles.container}>
        <ViewOption
            title="Sound notificaton"
        >
            <Switch />
        </ViewOption>

        <ViewOption
            title="Desktop notificaton"
        >
            <Switch />
        </ViewOption>

        <ViewOption
            title="Mention notification"
        >
            <Switch />
        </ViewOption>
    </div>
);
}
 
export default NotificationSettings;