import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./pages/layout/layout"
import Invitation from "./pages/invitation/invitation"
import Profil from "./pages/profile/profil"
import LoginSingUp from "./pages/login.signup/login.signup"
import Home from "./pages/home/home"
import Status from "./pages/status/status"


function App() {

  return (  
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<LoginSingUp />}/>
                <Route path="home" element={<Home />}/>
                <Route path="profil" element={<Profil />}/>
                <Route path="status" element={<Status />}/>
                <Route path="invitation" element={<Invitation />}/>
              </Route>
          </Routes>
      </BrowserRouter>
  )
}

export default App
