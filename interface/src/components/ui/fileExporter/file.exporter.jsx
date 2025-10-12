

import PropTypes from 'prop-types'

import { useContext, useRef, useState } from "react";
import { ChatBoxApiContext } from "/src/context/context";

import FileDeck from "/src/components/ui/fileDeck/file.deck";
import Modal from '/src/components/ui/modal/modal';
import styles from './file.exporter.module.css'

// import styles from "./file.exporter.module.css"


const FileExporter = ( { callback, children } ) => {

    const inputRef = useRef(null)
    const {  socket } = useContext(ChatBoxApiContext)
    const [ exportedFiles, setExportedFiles ] = useState(null)


    return ( 
        <div
            className={styles.container}
        >
            <div
                onClick={()=> {
                    if(inputRef.current){
                        inputRef.current.click()
                    }
                }}
            >
                { children }
            </div>
            <input
                hidden
                multiple
                type="file"
                ref={ inputRef }
                accept="image/*,video/*,.pdf"
                onChange={()=>{
                    if (inputRef.current.files) {
                        setExportedFiles(inputRef.current.files)
                    }
                }}
            />
            <div className={styles.modalContainer}>
                <div style={ !!exportedFiles ? { width: "100vw" ,height: "100vh" } : undefined }  className={styles.modalWrapper}>
                    <Modal
                        open={ !!exportedFiles }
                        styleContent= {{ background: 'transparent' }}
                        onClose= {()=>{
                                setExportedFiles(null)
                                if(inputRef.current?.value) inputRef.current.value = null
                        }}
                    >
                        <FileDeck
                            files = { exportedFiles }
                            inputRef = { inputRef }
                            onClose= {()=>{
                                setExportedFiles(null)
                            }}
                            onSend = { async (organizedFiles)=>{
                                if(socket){
                                    console.log({organizedFiles})
                                    callback(organizedFiles)
                                    setExportedFiles(null)  //clear the modal
                                }
                            }}
                        />
                    </Modal>
                </div>
            </div>
        </div>
     );
}
 
export default FileExporter;


FileExporter.propTypes = {
    callback: PropTypes.func,
    children: PropTypes.node,
}