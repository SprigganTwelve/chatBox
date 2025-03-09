
import ViewOption from "/src/components/ui/viewOption/view.option";
import Switch from "/src/components/ui/switch/switch"

import styles from "./confidentiality.module.css"

const Confidentiality = () => {
    return ( 
        <div className={styles.container}>
            <ViewOption
                title="Read receipts"
            >
                <Switch />
            </ViewOption>
            <ViewOption
                title="Typing indicator"
            >
                <Switch />
            </ViewOption>
            <ViewOption
                title="Auto delete messages"
            >
                <Switch />
            </ViewOption>
        </div>
     );
}
 
export default Confidentiality;