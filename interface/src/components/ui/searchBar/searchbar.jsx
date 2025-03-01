
import styles from "./searchbar.module.css"

const SearchBar = ({backgroundColor, width , height}) => {
    return ( 
        <div className={styles.container} >
                <input
                    className={styles.input}
                    style={{ 
                        backgroundColor: backgroundColor,
                        width: width,
                        height: height
                    }}
                />
                <div className={styles.inderline}/>
        </div>
     );
}
 
export default SearchBar;