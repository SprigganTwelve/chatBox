import PropTypes from 'prop-types';
import { flushSync } from 'react-dom'
import styles from './slider.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';

const Slider = ({ leading, onChange, containerStyles, defaultValue }) => {

    const completeGaugeWidth = 200;
    const holdTimeOut = useRef(null);
    const roundElementRef = useRef(null);
    const gaugeContainerRef = useRef(null)
    const conatinerRef = useRef(null)
    const [isHolding, setIsHolding] = useState(false);
    const [currentWidth, setCurrentWidth] = useState({ x: (defaultValue ?? 1) * completeGaugeWidth });


    const handleMouseMove = useCallback((event) => {
        if ( isHolding &&  gaugeContainerRef.current ) {
            const gaugeContainerRect = gaugeContainerRef.current.getBoundingClientRect();
            const newWidth = Math.max(0, Math.min(completeGaugeWidth, event.clientX - gaugeContainerRect.x));
            setCurrentWidth(()=> ({ x: newWidth  }));
        }
    },[gaugeContainerRef, isHolding])

    

    useEffect(() => {
        if (roundElementRef.current && gaugeContainerRef.current, conatinerRef.current) {


            const handleMouseDown = (event) => {
                event.preventDefault();
                holdTimeOut.current = setTimeout(() => {
                    setIsHolding(true);
                    console.log("Click maintaining...");
                }, 1000);
                const gaugeContainerRect = gaugeContainerRef.current.getBoundingClientRect();
                const newWidth = Math.max(0, Math.min(completeGaugeWidth,  event.clientX  - gaugeContainerRect.x));
                setCurrentWidth(()=>({ x: newWidth  }));
                window.addEventListener("mouseup", handleMouseUp);
            };
            roundElementRef.current.addEventListener('mousedown', handleMouseDown);


            const handleMouseUp = () => {
                flushSync(()=>{
                    setIsHolding( () => false );
                })
                clearTimeout(holdTimeOut.current);
                window.removeEventListener("mousemove", handleMouseMove);
            };
            roundElementRef.current.addEventListener('mouseup', handleMouseUp);


            window.addEventListener('mousemove', handleMouseMove);

        }
        else {
            console.log("[Slider] The round ref element is not valid");
        }
        return () =>  window.removeEventListener("mousemove", handleMouseMove);

    }, [gaugeContainerRef, handleMouseMove, roundElementRef]);



    useEffect(() => {
        if (isHolding) {
            console.log(currentWidth.x / completeGaugeWidth);
            if (onChange) {
                onChange(currentWidth.x / completeGaugeWidth);
            }
        }
    }, [currentWidth, isHolding, onChange]);



    return (
        <div style={containerStyles ?? {}}>
            <div 
                 ref={conatinerRef}
                 className={styles.container}
            >
                {leading && <img className={styles.icon} src={leading} alt="icon" />}
                <div 
                    ref={gaugeContainerRef}
                    className={styles.gaugeContainer}
                    onClick={(event)=>{
                        setIsHolding(() => false)
                        if ( gaugeContainerRef.current ) {
                            const gaugeContainerRect = gaugeContainerRef.current.getBoundingClientRect();
                            const newWidth = Math.max(0, Math.min(completeGaugeWidth, event.clientX - gaugeContainerRect.x));
                            flushSync(()=>{
                                setCurrentWidth( () => ({ x: newWidth  }) );
                            })
                            console.log("Jauge cliquée à :", newWidth / completeGaugeWidth);
                            if (onChange) {
                                onChange(newWidth / completeGaugeWidth);
                            }
                        }
                    }}
                >
                    <div 
                        style={{ width: currentWidth.x  }}
                        className={styles.gauge}
                    >
                        <div
                            ref={roundElementRef}
                            className={styles.round}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

Slider.propTypes = {
    onChange: PropTypes.func,
    leading: PropTypes.string,
    containerStyles: PropTypes.string,
    defaultValue: PropTypes.number,
};

export default Slider;
