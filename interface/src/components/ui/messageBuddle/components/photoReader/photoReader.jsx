import PropTypes from 'prop-types'

import styles from "./photo.reader.module.css";



const PhotoReader = ({ name, talkSphereFolder }) => {
    

    return ( 
        <div className={styles.container}>
            <img 
                alt=""
                className={ styles.image }
                src={
                    `http://localhost:${import.meta.env.VITE_API_PORT}/uploads/talkspheres/${talkSphereFolder}/photos/${name}`
                }
            />
        </div>
     );
}


export default PhotoReader;

PhotoReader.propTypes = {
    name: PropTypes.string,
    talkSphereFolder: PropTypes.string,
}