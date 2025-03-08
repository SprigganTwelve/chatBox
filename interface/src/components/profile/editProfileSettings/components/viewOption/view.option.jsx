import React from "react"
import PropTypes from "prop-types"
import styles from "./view.option.module.css"


const ViewOption = ({ title, description = "",leading, children, onClick = () => {} }) => {
    return ( 
        <div 
            className={styles.container}
            onClick={onClick}
        >
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
    children: React.Children,
    onClick: PropTypes.func
}
 
export default ViewOption;