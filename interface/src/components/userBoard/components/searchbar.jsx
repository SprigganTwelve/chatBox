
import styles from "./searchbar.module.css"

const SearchBar = () => {
    return ( 
        <div className={styles.container} >
                <input className={styles.input} />
                <div className={styles.inderline}/>
        </div>
     );
}
 
export default SearchBar;