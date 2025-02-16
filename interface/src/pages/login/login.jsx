
import ChatBoxForm from "../../components/ui/form/form";
import styles from "./login.module.css"

const Login = () => {
    return ( 
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <ChatBoxForm title="">
                    <input type="text" placeholder="Pseudo"/>
                    <input type="text" placeholder="Password" />
                </ChatBoxForm>
            </div>
        </div>
     );
}
 
export default Login;