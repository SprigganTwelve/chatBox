
import styles from "./searchbar.module.css"
import SearchIcon from "../../../assets/svg/search-alt-2-svgrepo-com.svg"

const SearchBar = () => {
    return ( 
        <div className={styles.container} >
                <input className={styles.input} />
                <div className={styles.inderline}/>
        </div>
     );
}
 
export default SearchBar;