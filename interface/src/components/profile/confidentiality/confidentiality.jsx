
import axios from "axios";
import PropTypes from "prop-types";
import ViewOption from "/src/components/ui/viewOption/view.option";
import Switch from "/src/components/ui/switch/switch"

import styles from "./confidentiality.module.css"
import { useContext } from "react";
import { ChatBoxApiContext } from "/src/context/context";

const Confidentiality = ({ defaultSettings, baseApiURL }) => {

    const handleChangeBasicsSettings = async ({key, value, id}) => {
        try{
            const response = await axios.patch(`${baseApiURL.current}/settings/general/basics`, {key, value, id})
            if(response.status !== 200) {
                console.log("Something went wrong when changing the setting, response : ", response)
                return ;
            };
        }
        catch(error){
            console.log("Something went wrong when changing the setting, error : ", error)
        }
    }

    return ( 
        <div className={styles.container}>
            <ViewOption
                title="Read receipts"
            >
                <Switch
                    defaultValue= {defaultSettings.read_receipts}
                    callback = {(state)=> {
                        handleChangeBasicsSettings({ 
                            id: defaultSettings.settings_id, 
                            key: "read_receipts" ,
                            value: +state
                        })
                    }}  
                />
            </ViewOption>
            <ViewOption
                title="Typing indicator"
            >
                <Switch
                    defaultValue= {defaultSettings.typing_indicator}
                    callback = {(state)=> {
                        handleChangeBasicsSettings({ 
                            id: defaultSettings.settings_id, 
                            key: "typing_indicator" ,
                            value: +state
                        })
                    }}  
                />
            </ViewOption>
            <ViewOption
                title="Auto delete messages"
            >
                <Switch
                    defaultValue= {defaultSettings.auto_delete_messages}
                    callback = {(state)=> {
                        handleChangeBasicsSettings({ 
                            id: defaultSettings.settings_id, 
                            key: "auto_delete_messages" ,
                            value: +state
                        })
                    }} 
                />
            </ViewOption>
        </div>
     );
}
 
export default Confidentiality;

Confidentiality.propTypes = {
    defaultSettings: PropTypes.shape({
        settings_id: PropTypes.number,
        read_receipts: PropTypes.number,
        auto_delete_messages: PropTypes.number,
        typing_indicator: PropTypes.string,
    }),
}