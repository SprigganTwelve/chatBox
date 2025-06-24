

import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'
import styles from './modal.module.css'



/* For make this work you must provide the following object type to the set modal state function created in the context :
        { open: boolean, showCancelAndConfirmButtons?: boolean, onContinueHandler?: function , stylesContainer: objectStyles, styleContent?: styleObject  }
    The modal is close by turning open into false;
    The modal is clear by passing null or false to the setModal function
*/

/* {
     open: bool,
     onClose?: bool,
     lockClosingWithTouchOnBackground: bool,
     onContinueHandler: void function,
     showCancelAndConfirmButtons: bool,
     ModalComponent: React.Component (JSX),
     styleContent: style object,
     stylesContainer: style object,
   }
*/



const Modal = ({
    open,
    onClose,
    onContinueHandler,
    showCancelAndConfirmButtons = false,
    children,
    styleContent = {},
    stylesContainer = {},
    lockClosingWithTouchOnBackground = true,
}) => {
    const modalRef = useRef(null)

    
    //Click handling

    useEffect(() => {
        if (!open || !lockClosingWithTouchOnBackground) return

        const handleOnMouseDown = (event) => {
            if (!modalRef.current || modalRef.current.contains(event.target)) return
            if (onClose) onClose()
        }

        document.addEventListener("mousedown", handleOnMouseDown)

        return () => {
            document.removeEventListener("mousedown", handleOnMouseDown)
        }
    }, [open, onClose, lockClosingWithTouchOnBackground])


    if (!open) return null

    return (
        <div className={styles.container} style={stylesContainer}>
            <div
                ref={modalRef}
                className={styles.content}
                style={styleContent}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className={styles.children}>
                    {children ? children : <p>No component set</p>}
                </div>

                {showCancelAndConfirmButtons && (
                    <div className={styles.buttonContainer}>
                        <button onClick={onClose}>Cancel</button>
                        <button
                            onClick={() => {
                                if (onContinueHandler) onContinueHandler()
                                if(onClose) onClose()
                            }}
                        >
                            Continue
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

Modal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onContinueHandler: PropTypes.func,
    showCancelAndConfirmButtons: PropTypes.bool,
    children: PropTypes.node, 
    styleContent: PropTypes.object,
    stylesContainer: PropTypes.object,
    lockClosingWithTouchOnBackground: PropTypes.bool,
}

export default Modal
