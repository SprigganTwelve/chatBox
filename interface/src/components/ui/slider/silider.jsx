
import clsx from 'clsx'
import PropTypes from 'prop-types'
import styles from './slider.module.css'

const Slider = ({ leading, callback, containerStyles }) => {
    return ( 
        <div className={clsx(styles.container, containerStyles ?? "" )}>
            <img className={styles.icon} src={leading} alt="image" />
            <div className={styles.gauge}/>
        </div>
     );
}

Slider.propTypes = {
    callback: PropTypes.func,
    leading: PropTypes.object,
}
 
export default Slider;