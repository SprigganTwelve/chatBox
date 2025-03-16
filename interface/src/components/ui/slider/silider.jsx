import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './slider.module.css';
import { useEffect, useRef, useState } from 'react';

const Slider = ({ leading, onChange, containerStyles }) => {

    const holdTimeOut = useRef(null)
    const roundElementRef = useRef(null)
    const [position, setPosition] = useState( { x: 0 } )
    const [isHolding, setIsHolding] = useState(false)

    const handleMouseDown = ()=> {
        roundElementRef.current = setTimeout(()=>{
            setIsHolding(true)
            console.log("Click maintaining...")
        }, 1000)
    }

    const handleMouseUp = () => {
        clearTimeout(holdTimeOut)
        setIsHolding(false)
    }

    useEffect(()=>{
        if (roundElementRef.current) {
            const rect = roundElementRef.current.getBoundingClientRect()

            //eventHandler
            roundElementRef.current.addEventListener('mousedown',(event)=>{
                
            })
            roundElementRef.current.addEventListener('mouseup',(event)=>{

            })
            roundElementRef.current.addEventListener('mouseLeave',(event)=>{

            })

            setPosition({x: 0})
        }
    },[])

    return ( 
        <div style={ containerStyles ?? {} }>
            <div className={styles.container}>
                {leading && <img className={styles.icon} src={leading} alt="icon" />}
                <div className={styles.gaugeContainer}>
                     <div className={styles.gauge}>
                        <div 
                            ref={roundElementRef} className={styles.round} />
                     </div>
                </div>
            </div>
        </div>
     );
}

Slider.propTypes = {
    onChange: PropTypes.func,
    leading: PropTypes.string, 
    containerStyles: PropTypes.string, 
};

export default Slider;
