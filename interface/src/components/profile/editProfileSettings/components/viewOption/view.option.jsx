import React from "react"
import PropTypes from "prop-types"
import styles from "./view.option.module.css"


const ViewOption = ({ title, description = "", children }) => {
    return ( 
        <div className={styles.container}>
            <div className={styles.textSection}>
                <span>{title}</span>
                <p>{description}</p>
            </div>
            { children }
        </div>
     );
}

ViewOption.propTypes = {
    title: PropTypes.string.isRequired,
    description:PropTypes.string,
    children: React.Children
}
 
export default ViewOption;