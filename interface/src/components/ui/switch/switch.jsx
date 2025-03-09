import { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types"; 
import styles from "./switch.module.css";

const Switch = ({ defaultValue , callback = () => {} }) => {
    const [isOn, setIsOn] = useState(defaultValue);

    const handleClick = () => {
        setIsOn((state) => !state);
        callback(!isOn);
    };

    return (
        <div 
            className={styles.container}
            style={{backgroundColor: isOn ? "#e100ff" : "#008cff"}} 
            onClick={handleClick}
        >
            <span className={styles.text}>{isOn ? "On" : "Off"}</span>
            <div 
                className={clsx(styles.rond, isOn ? 
                styles.toRight
                : styles.toLeft
                )}
                style={{backgroundColor: isOn ? "#008cff" :  "#e100ff"   }} 
            />
        </div>
    );
};

Switch.propTypes = {
    defaultValue: PropTypes.number,
    callback: PropTypes.func,
};

export default Switch;
