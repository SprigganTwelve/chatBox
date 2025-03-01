import React from "react"
import PropTypes from "prop-types"
import styles from "./view.option.module.css"


const ViewOption = ({ title, description = "",leading, children }) => {
    return ( 
        <div className={styles.container}>
            <div className={styles.textSection}>
                {leading && <img className={styles.leading} src={leading} alt="" /> }
                <div>
                    <span>{title}</span>
                    <p>{description}</p>
                </div>
            </div>
            { children }
        </div>
     );
}

ViewOption.propTypes = {
    title: PropTypes.string.isRequired,
    description:PropTypes.string,
    leading: PropTypes.object,
    children: React.Children
}
 
export default ViewOption;