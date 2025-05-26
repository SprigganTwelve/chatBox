import PropTypes from 'prop-types'

import SVGclose from '/src/assets/svg/close-circle-svgrepo-com.svg'

import styles from './closing.frame.module.css'

const ClosingFrame = ({ children, onclose, positions = [ '3px', '3px' ] }) => {
    return ( 
        <div 
            className={styles.main}
        >
            <img 
                src={SVGclose}
                onClick={ ()=> onclose() }
                className={styles.closeIcon}
                style={{
                    "--top-position" : `${positions[0]}`,
                    "--right-position": positions.length > 1 ? `${positions[1]}` : '3px'
                }}
            />
            { children }
        </div>
    );
}
 
export default ClosingFrame;


ClosingFrame.propTypes = {
    onclose: PropTypes.func,
    children: PropTypes.node,
    positions: PropTypes.array,
}