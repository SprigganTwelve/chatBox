import { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types"; 
import styles from "./switch.module.css";

const Switch = ({ callback = () => {} }) => {
    const [isOn, setIsOn] = useState(false);

    const handleClick = () => {
        const newState = !isOn;
        setIsOn(newState);
        callback(newState);
    };

    return (
        <div className={styles.container} onClick={handleClick}>
            <div className={clsx(styles.rond, isOn ? styles.toRight : styles.toLeft)} />
        </div>
    );
};

Switch.propTypes = {
    callback: PropTypes.func,
};

export default Switch;
