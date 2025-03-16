
import PropTypes from 'prop-types'

import styles from './menu.item.module.css'

const MenuItem = ({leading, title, onClick= ()=>{}}) => {
    return ( 
        <div 
            className={styles.iconContainer}
            onClick={onClick}
        >
            <img className={styles.icon}  src={leading} alt="image" />
            <span>{title}</span>
        </div>
     );
}
MenuItem.propTypes = {
    leading: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func
}
 
export default MenuItem
;