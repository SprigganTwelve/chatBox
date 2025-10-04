
import axios from "axios";
import PropTypes from 'prop-types'

import ViewOption from "/src/components/ui/viewOption/view.option";
import Switch from "/src/components/ui/switch/switch"

import styles from "./notification.settings.module.css"
import { useCallback } from "react";

const NotificationSettings = ({ defaultSettings, baseApiURL }) => {
    
    const handleChangeBasicsSettings = useCallback(async ({key, value, id}) => {
        if (!id || !key) return;
        try{
            const response = await axios.patch(`${baseApiURL.current}/settings/general/basics`, {key, value, id})
            if(response.status !== 200) {
                console.log("Something went wrong when changing the setting, response : ", response)
                return;
            };
        }
        catch(error){
            console.log("Something went wrong when changing the setting, error : ", error)
        }
    },[])

    return (
    <div className={styles.container}>
        <ViewOption
            title="Sound notificaton"
        >
            <Switch
                defaultValue= {defaultSettings.sound_notification}
                callback = { (state)=> {
                    handleChangeBasicsSettings({ 
                        id: defaultSettings.settings_id, 
                        key: "sound_notification" ,
                        value: +state
                        })
                    }}  
            />
        </ViewOption>

        <ViewOption
            title="Desktop notificaton"
        >
            <Switch
                defaultValue= {defaultSettings.desktop_notification}
                callback = {(state)=> {
                    handleChangeBasicsSettings({ 
                        id: defaultSettings.settings_id, 
                        key: "desktop_notification" ,
                        value: +state
                        })
                    }}  
            />
        </ViewOption>

        <ViewOption
            title="Mention notification"
        >
            <Switch
                defaultValue= {defaultSettings.mention_notification}
                callback = {(state)=> {
                    handleChangeBasicsSettings({ 
                        id: defaultSettings.settings_id, 
                        key: "mention_notification" ,
                        value: +state
                        })
                    }}  
            />
        </ViewOption>
    </div>
);
}
 
export default NotificationSettings;

NotificationSettings.propTypes = {
       defaultSettings: PropTypes.shape({
           settings_id: PropTypes.number,
           sound_notification: PropTypes.number,
           mention_notification: PropTypes.number,
           desktop_notification: PropTypes.number,
       }),
}