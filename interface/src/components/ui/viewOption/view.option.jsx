import React from "react"
import PropTypes from "prop-types"
import styles from "./view.option.module.css"


const ViewOption = ({ 
        title,
        pulse,
        radius,
        leading,
        padding,
        children,
        description = "",
        onClick = () => {}
}) => {
    return ( 
        <div 
            className={styles.container}
            onClick={onClick}
            style={{
                "--pulse": pulse ? pulse : "10px",
                "--radius": radius ? radius : "10px",
                '--padding': padding ? padding : "20px 20px"
            }}
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
    pulse: PropTypes.number,
    onClick: PropTypes.func,
    children: React.Children,
    radius: PropTypes.number,
    padding: PropTypes.string,
    leading: PropTypes.object,
    description:PropTypes.string,
    title: PropTypes.string.isRequired,
}
 
export default ViewOption;