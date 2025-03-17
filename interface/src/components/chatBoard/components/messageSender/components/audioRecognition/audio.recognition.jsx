
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'

import styles from './audio.recognition.module.css' 

import SVGvoicerecognition from '/src/assets/svg/lineage-recorder-svgrepo-com.svg'



let recognition = null

if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition() 
    recognition.continous  = true;
    recognition.lang = "fr-FR"
}


const AudioRecognition = ({ onChange = ()=>{} }) => {

    const [text, setText] = useState('')
    const [isListening, setIsListening] = useState(false)

    useEffect(()=>{
        if (!recognition)  return;
        recognition.onresult = ( event ) => {
            setText(event.results[0][0].transcript)
            console.log(text)
            recognition.stop()
            setIsListening(false)
        }
    },[])
    
    useEffect(()=>{
        if (!isListening && text.trim() !== '') {
            onChange(text)
        }
    }, [isListening, text, onChange])
    
    const startListening = ()=>{
        setText('')
        setIsListening(true)
        recognition.start()
    }
    

    return ( 
        <div>
            {
                recognition && (
                    <img
                    alt=""
                    className={styles.icon}
                    src={SVGvoicerecognition}
                    onClick={()=>{
                      if(recognition)  startListening()
                    }}
                />
                )
            }
        </div>
     );
}
 

AudioRecognition.propTypes = {
    onChange: PropTypes.func
}

export default AudioRecognition;