import { useContext, useEffect, useRef } from "react";
import PropTyes from 'prop-types'
import { ChatBoxApiContext } from "/src/context/context";
import styles from "./modal.module.css"

const Modal = () => {
    const modalRef = useRef(null)
    const { modal, setModal, ContainerX } = useContext(ChatBoxApiContext)
    
    useEffect(()=>{
        const handleOnMouseDown = (event) =>{
            if (!modalRef.current || modalRef.current.contains(event.target)) {
                return;
              }
              setModal(false);
        }
        document.addEventListener("mousedown", handleOnMouseDown)
        return () => {
            document.removeEventListener("mousedown", handleOnMouseDown)
        }
    }, [])

    return ( 
        <>
            {modal && modal.open && (
                    <div
                        className={styles.container}
                    >
                        <div
                            ref={modalRef}
                            className={styles.content}
                            style={modal.styleContent}
                        >
                            <div
                                className={styles.children}
                            >
                                <ContainerX.current />
                            </div>

                               {
                                modal.showCancelAndConfirmButtons && (
                                    <div
                                        className={styles.buttonContainer}
                                    >
                                        <button
                                            onClick={()=>setModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={()=>{
                                                modal.onContinueHandler && modal.onContinueHandler()
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