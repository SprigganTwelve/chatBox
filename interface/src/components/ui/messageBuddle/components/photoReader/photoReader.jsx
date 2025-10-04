import PropTypes from 'prop-types'

import styles from "./photo.reader.module.css";



const PhotoReader = ({ name, talkSphereFolder, baseApiURL }) => {
    

    return ( 
        <div 
            className={styles.container}
            onClick={ () => window.open( `${baseApiURL.current}/uploads/talkspheres/${talkSphereFolder}/photos/${name}`, '_blank') }
        >
            <img 
                alt=""
                className={ styles.image }
                src={
                    `${baseApiURL.current}/uploads/talkspheres/${talkSphereFolder}/photos/${name}`
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