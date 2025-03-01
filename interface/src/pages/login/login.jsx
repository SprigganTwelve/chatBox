
import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import ChatBoxForm from "/src/components/ui/form/form";
import Input from "/src/components/ui/input/input";
import SVGOutlook from "/image/social/outlook.png"
import SVGYahoot from "/image/social/yahoot.png"
import SVGGoogle from "/image/social/google-icon.png"
import styles from "./login.module.css"
import { ChatBoxApiContext } from "/src/context/context";

const Login = () => {

    const navigate = useNavigate()
    const [formResponse, setFormResponse] = useState(null)
    const [isNotRegistered, setIsNotRegistered] = useState(false)

    const { userId, setUserId } = useContext(ChatBoxApiContext)

    useEffect(()=>{
        if(userId){
            navigate("/home")
        }
    }, [userId])

    useEffect(()=>{
        if(!formResponse?.data.message && !formResponse?.data.user){ 
           //when message = "" the user is sign up
           if(isNotRegistered) setIsNotRegistered(false)
        }
        if(formResponse?.data.user){
            navigate("/home")
            setUserId(formResponse.data.user.id)
            localStorage.setItem("userId", JSON.stringify(formResponse.data.user.id))
            window.location.reload();
        }
    }, [formResponse])
    
    return ( 
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <ChatBoxForm 
                    title={isNotRegistered ? "Sign Up" : "Login"}
                    btnContent ={isNotRegistered ? "Sing Up" : "Login"}
                    backendResponse = {formResponse}
                    setBackendResponse = {setFormResponse}
                    url= {isNotRegistered ?  "http://localhost:3000/users/signUp" : "http://localhost:3000/users/login"  }
                >
                    {  !isNotRegistered ?
                        (
                            <>
                                <Input
                                    name="email"
                                    title="email"
                                    placeholder=" 👤 Type your email"
                                />
                                <Input
                                    title="password"
                                    type = "password"
                                    placeholder=" 🔒 Type your password"
                                />
                            </>
                        )
                        : (
                            <>
                                <Input
                                    title="name"
                                    placeholder=" 🔒 Type your name"
                                />
                                <Input
                                    title="pseudo"
                                    placeholder=" 🔒 Type pseudo"
                                />
                                <Input
                                    title="email"
                                    type= "email"
                                    placeholder=" 🔒 Type your email"
                                />
                                <Input
                                    title="password"
                                    type = "password"
                                    placeholder=" 🔒 Type your password"
                                />
                                <Input
                                    name="file"
                                    type="file"
                                    placeholder=" 🔒 Type your password"
                                />
                            </>
                        )
                    }
                    <div id="next" className={styles.next}>
                        <span 
                            className={styles.span} onClick={()=> {
                                setIsNotRegistered(!isNotRegistered)
                                setFormResponse(null)
                            }}
                        >
                            &nbsp; {isNotRegistered ? "using Sign In" : "using Sign Up"} &nbsp;
                        </span>
                        <div>
                            <img className={styles.icon} src={SVGGoogle} alt="google-icon" />
                            <img className={styles.icon} src={SVGYahoot} alt="google-icon" />
                            <img className={styles.icon} src={SVGOutlook} alt="google-icon" />
                        </div>
                    </div>
                </ChatBoxForm>
                
            </div>
        </div>
     );
}
 
export default Login;