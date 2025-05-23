import PropTypes from 'prop-types'

import SVGclose from '/src/assets/svg/close-circle-svgrepo-com.svg'

import styles from './closing.frame.module.css'

const ClosingFrame = ({ children, onclose }) => {
    return ( 
        <div 
            className={styles.main}
        >
            <img 
                src={SVGclose}
                onClick={ ()=> onclose() }
                className={styles.closeIcon}
            />
            { children }
        </div>
    );
}
 
export default ClosingFrame;


ClosingFrame.propTypes = {
    onclose: PropTypes.func,
    children: PropTypes.node,
}