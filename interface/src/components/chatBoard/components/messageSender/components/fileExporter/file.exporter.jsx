

import SVGfile from "/src/assets/svg/file.svg"

import styles from "./file.exporter.module.css"
import { useContext, useEffect, useRef, useState } from "react";
import { ChatBoxApiContext } from "/src/context/context";
import FileDeck from "/src/components/ui/fileDeck/file.deck";

const FileExporter = () => {

    const inputRef = useRef(null)
    const { modal, setModal } = useContext(ChatBoxApiContext)
    const [ exportedFiles, setExportedFiles ] = useState(null)

    useEffect(()=> {
        if( exportedFiles && setModal && !modal  ){

            console.log({ exportedFiles })

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
                            onSend = {()=>{

                            }}
                        />
                    ) 
                }
            }))
        }
    }, [exportedFiles, modal, setModal])

    return ( 
        <div>
            <img 
                src={SVGfile}
                alt="Import file"
                className={styles.icon}
                onClick={()=> {
                    if(inputRef.current){
                        inputRef.current.click()
                    }
                }}
            />
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
