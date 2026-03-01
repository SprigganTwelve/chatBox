import PropTypes from 'prop-types'
import { createContext, useState } from "react";


export const SideBarContext = createContext()

const SideBarContextProvider = ({children}) => {

    const [ breakPoint, setBreakPoint ] = useState(window.innerWidth <= 428); // better for perfoemance than using windown resize event
    const [ isUserPanelVisibleOnMobile, setIsUserPanelVisibleOnMobile  ] = useState(false);

    return ( 
        <SideBarContext.Provider 
            value={ { 
                breakPoint, setBreakPoint,
                isUserPanelVisibleOnMobile, setIsUserPanelVisibleOnMobile
            } }
        >
            { children }
        </SideBarContext.Provider>
    );
    
}
 

export default SideBarContextProvider;

SideBarContext.propTypes = {
    children: PropTypes.object,
}