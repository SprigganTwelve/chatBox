import React, { useContext } from "react";
import { ChatBoxApiContext } from "/src/context/context";
import styles from "./modal.module.css"

const Modal = ({children}) => {
    const { modal } = useContext(ChatBoxApiContext)
    return ( 
        <div className={styles.container}>
            {modal && (
                <>
                    <div className={styles.children}>
                            {/* {children} */}
                      ssss
                    </div>
                    <div>
                        <button>Cancel</button>
                        <button>Ok</button>
                    </div>
                </>
            )}
        </div>
     );
}
 
Modal.propTypes = {
    children: React.Children
}

export default Modal;