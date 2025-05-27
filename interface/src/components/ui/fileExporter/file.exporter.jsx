

import PropTypes from 'prop-types'

import { useContext, useEffect, useRef, useState } from "react";
import { ChatBoxApiContext } from "/src/context/context";

import FileDeck from "/src/components/ui/fileDeck/file.deck";


// import styles from "./file.exporter.module.css"


const FileExporter = ( { callback, children } ) => {

    const inputRef = useRef(null)
    const { modal, setModal, socket } = useContext(ChatBoxApiContext)
    const [ exportedFiles, setExportedFiles ] = useState(null)

    useEffect(()=> {

        if( exportedFiles && setModal && !modal  ){



            setModal(()=> ({
                open: true,
                onClose: ()=>{
                    setExportedFiles(null)
                },
                styleContent: {
                    backgroundColor: "transparent"
                },
                ModalComponent: ()=>{
                    return (
                        <FileDeck
                            files = { exportedFiles }
                            inputRef = { inputRef }
                            onSend = {async (organizedFiles)=>{
                                if(socket){
                                    callback(organizedFiles)
                                    setModal(null)  //clear the modal
                                }
                            }}
                        />
                    ) 
                }
            }))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exportedFiles])

    return ( 
        <div>
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
        </div>
     );
}
 
export default FileExporter;


FileExporter.propTypes = {
    callback: PropTypes.func,
    children: PropTypes.node,
}