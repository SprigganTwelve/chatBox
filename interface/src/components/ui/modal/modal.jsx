import PropTyes from 'prop-types'

import { useContext, useEffect, useRef } from "react";
import { ChatBoxApiContext } from "/src/context/context";

import styles from "./modal.module.css"

/* For make this work you must provide the following object type to the set modal state function created in the context :
        { open: boolean, showCancelAndConfirmButtons?: boolean, onContinueHandler?: function , stylesContainer: objectStyles, styleContent?: styleObject  }
*/

/* {
     open: bool,
     onClose?: bool,
     onContinueHandler: void function,
     showCancelAndConfirmButtons: bool,
     ModalComponent: React.Component (JSX),
     styleContent: style object
   }
*/

const Modal = () => {
    const modalRef = useRef(null)
    const { modal, setModal } = useContext(ChatBoxApiContext)
    
    useEffect(()=>{
        const handleOnMouseDown = (event) =>{
            if (!modalRef.current || modalRef.current.contains(event.target)) {
                return;
            }

            if( modal && modal.onClose ){
                console.log("modal", modal)
                modal.onClose()
            }
            setModal(()=> false);
        }
        document.addEventListener("mousedown", handleOnMouseDown)
        return () => {
            document.removeEventListener("mousedown", handleOnMouseDown)
        }
    }, [modal, setModal])

    return ( 
        <>
            { modal && modal.open && (
                    <div
                        className={styles.container}
                        style={modal.stylesContainer}
                    >
                        <div
                            ref={modalRef}
                            className={styles.content}
                            style={modal.styleContent}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <div
                                className={styles.children}
                            >
                                { modal.ModalComponent ? < modal.ModalComponent /> : <p>No component set</p> }
                            </div>

                               {
                                modal.showCancelAndConfirmButtons && (
                                    <div
                                        className={styles.buttonContainer}
                                    >
                                        <button
                                            onClick={()=>{
                                                console.log('modal', modal)
                                                if(modal.onClose) {
                                                    modal.onClose()
                                                }
                                                setModal(false)
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={()=>{
                                               if ( modal.onContinueHandler) {
                                                    modal.onContinueHandler()
                                                }   
                                                setModal(false)
                                            }}
                                        >
                                            Continue
                                        </button>
                                    </div>

                                )
                               }
                        </div>
                    </div>
            )}
        </>
     );
}
 
Modal.propTypes = {
    children: PropTyes.node
}

export default Modal;