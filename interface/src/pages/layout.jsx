import { Outlet } from 'react-router-dom';
import { ChatBoxApiContextProvider } from '/src/context/context'

const Layout = () => {
    return ( 
        <ChatBoxApiContextProvider>
            <Outlet />
        </ChatBoxApiContextProvider>
     );
}
 
export default Layout;