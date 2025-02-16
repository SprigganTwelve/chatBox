import UserBoard from '/src/components/userBoard/user.board'
import ChatBoard from '/src/components/chatBoard/chat.board'
import Settings from '/src/components/settings/settings'
import styles from "./home.module.css"

const Home = () => {
    return ( 
        <>
            <div className={styles.container}>
                <UserBoard />
                <ChatBoard />
                <Settings />
            </div>
        </> 
    );
}
 
export default Home;