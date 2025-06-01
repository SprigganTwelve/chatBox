
import PropTypes from 'prop-types'
import styles from './circular.progressor.module.css'
import { useEffect, useState } from 'react';



const CircularProgressor = ({
    progress = 0,
    strokeDasharray=450,
}) => {

    const [ strokeDashoffset, setStrokeDashoffset ] = useState(0)

    useEffect(()=>{
        setStrokeDashoffset(strokeDasharray * (1 - progress));
    },[progress, strokeDasharray])
    

    return ( 
        <div className={styles.main}>
            <div className={styles.outer}>
                <div className={styles.inner}>
                    <div className={styles.indicator}>
                        { (progress * 100) + "%" }
                    </div>
                </div>
            </div>
            <svg className={styles.svg} viewBox="0 0 100 100" width="100%" height="100%">
                <defs>
                    <linearGradient id="GradientColor">
                    <stop offset="0%" stopColor="#e100ff" />
                    <stop offset="100%" stopColor="#008cff" />
                    </linearGradient>
                </defs>
                <circle
                    className={styles.circle}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    strokeWidth="10"
                    stroke="url(#GradientColor)"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                />
            </svg>
        </div>
     );
}
 
export default CircularProgressor;

CircularProgressor.propTypes = {
    progress: PropTypes.number,
    strokeDasharray: PropTypes.number
}