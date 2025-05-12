

import SVGfile from "/src/assets/svg/file.svg"

import styles from "./file.exporter.module.css"

const FileExporter = () => {
    return ( 
        <div>
            <img src={SVGfile} alt="Import file" className={styles.icon} />
        </div>
     );
}
 
export default FileExporter;
