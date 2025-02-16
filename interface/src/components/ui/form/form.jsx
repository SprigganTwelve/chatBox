
import styles from "./form.module.css"

const ChatBoxForm = ({ title, children }) => {
    return ( 
        <div className={styles.container}>
            <span> { title }</span>
            <form action="" onSubmit={(  ) => {}}>
                {children}
                <button>Envoyer</button>
            </form>
        </div>
     );
}
 
export default ChatBoxForm;