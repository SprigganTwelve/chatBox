import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./pages/layout"
import Login from "./pages/login/login"
import Home from "./pages/home/home"


function App() {

  return (  
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Login />}/>
                <Route path="/home"  element={<Home />}/>
              </Route>
          </Routes>
      </BrowserRouter>
  )
}

export default App
