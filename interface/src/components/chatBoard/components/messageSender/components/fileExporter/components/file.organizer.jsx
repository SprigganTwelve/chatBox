import PropTypes from 'prop-types'
import styles from './file.organizer.module.css'
import {  useEffect, useRef, useState } from 'react';

import SVGadd from '/src/assets/svg/add-circle-svgrepo-com.svg'
import SVGclose from '/src/assets/svg/close-circle-svgrepo-com.svg'

import ClosingFrame from '/src/components/ui/closingFrame/closing.frame';
import FrameSnapper from '/src/components/ui/VideoframeSnapper/video.frame.snapper';





const FileDeck = ({
    files,
    onSend,
    inputRef
}) => {

    const viewOptions = useRef(["Images", "Videos", "PDF"])
    const [ organizedFiles, setOrganizedFiles ] = useState()
    const [ currentOption, setCurrentOption ] = useState("images")

    useEffect(()=>{

        const filesOrganizingHandler = () => {

            const fileDeckData = {
                pdf: [],
                images:[],
                videos: [],
                others: [],
            }
            console.log({files})
            for(const singleFile of files){
                if(singleFile.type.includes('image')){
                    fileDeckData.images.push(singleFile)
                }
                else if(singleFile.type.includes('video')){
                    fileDeckData.videos.push(singleFile)
                    console.log("video",{singleFile}, 'filedekdata', fileDeckData)
                }
                else if(singleFile.type.includes('pdf')){
                    fileDeckData.pdf.push(singleFile)
                }else {
                    fileDeckData.others.push(singleFile)
                }
            }
            return fileDeckData

        }

        setOrganizedFiles(()=> filesOrganizingHandler())

    },[files])


    return ( 
        <div className={styles.main}>
            <div
                className={styles.options}
            >
                {
                    viewOptions.current.map((title, index)=>(
                        <div
                            key={index}
                            className={ currentOption === title.toLowerCase() && styles.isActive }
                            onClick={()=> {
                                setCurrentOption(() => title.toLowerCase())
                            }}
                        >
                            <span>{title}</span>
                        </div>
                    ))
                }
            </div>
            
            <div className={styles.line}/>

            <div className={styles.cardSection}>
                {
                   currentOption && organizedFiles && (
                        currentOption === "images" && Array.isArray(organizedFiles.images) ? (
                            organizedFiles.images.map((image, index)=>
                                <ClosingFrame 
                                    key={index}
                                    onclose= {()=>{
                                        setOrganizedFiles( ()=> {
                                           organizedFiles.images.splice(index, 1)
                                           return { ...organizedFiles }
                                        })
                                    }}
                                >
                                    <img 
                                        className={styles.images}
                                        src={ URL.createObjectURL(image) }
                                    /> 
                                </ClosingFrame>
                            )
                        )
                        : currentOption === "videos" && Array.isArray(organizedFiles.videos) ? (
                            organizedFiles.videos.map((video, index)=>(
                                <ClosingFrame
                                    key={index}
                                    onclose= {()=>{
                                        setOrganizedFiles( ()=> {
                                           organizedFiles.videos.splice(index, 1)
                                           return { ...organizedFiles }
                                        })
                                    }}
                                >
                                    <div className={styles.videos}>
                                        <FrameSnapper file={video} />
                                    </div>
                                </ClosingFrame>
                            ))
                        )
                        : currentOption === "pdf" && Array.isArray(organizedFiles.pdf) && (
                            organizedFiles.pdf.map((pdf, index)=>(
                                <ClosingFrame
                                    key={index}
                                    onclose= {()=>{
                                        setOrganizedFiles( ()=> {
                                           organizedFiles.pdf.splice(index, 1)
                                           return { ...organizedFiles }
                                        })
                                    }}                                
                                >
                                    <img 
                                        className={styles.pdf}
                                        src= "/image/PDF_file_icon.svg.png"
                                        alt='Image'
                                    /> 
                                </ClosingFrame>
                            ))
                        )
                        
                    )
                }
            </div>
            <div className={styles.buttonSection}>
                <div className={styles.iconContainer}>
                    <img 
                        alt="close"
                        src={SVGclose} 
                        className={styles.icon}
                    />
                </div>
                <div className={styles.iconContainer}>
                    <img 
                        alt="add"
                        src={SVGadd} 
                        className={styles.icon}
                        onClick={()=>{
                            if(inputRef) {
                                inputRef.current.click()
                            }
                        }}
                    />
                </div>
                <button 
                    className={styles.onSendButton} 
                    onClick={ ()=> {
                        if(onSend)  onSend(organizedFiles) 
                    }}
                >
                    Send
                </button>
            </div>
        </div>
     );
}
 
export default FileDeck;

FileDeck.propTypes = {
    onSend: PropTypes.func,
    inputRef: PropTypes.object,
    files: PropTypes.arrayOf(PropTypes.object)
}