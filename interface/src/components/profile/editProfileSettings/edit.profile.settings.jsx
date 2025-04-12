
import axios from "axios"
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { ChatBoxApiContext } from '/src/context/context';

import ChatBoxForm from "/src/components/ui/form/form";
import Input from "/src/components/ui/input/input";
import Switch from "/src/components/ui/switch/Switch"
import FlexEdit from "/src/components/ui/flexEdit/flex.edit"
import ViewOption from "/src/components/ui/viewOption/view.option";
import styles from "./edit.profile.settings.module.css"

import SVGabout from "/src/assets/svg/about-filled-svgrepo-com.svg"
import SVGdisponibility from "/src/assets/svg/telephone-line-24-hours-service-svgrepo-com.svg"
import SVGdvisibility from "/src/assets/svg/visibility-svgrepo-com.svg"
import SVGdchange from "/src/assets/svg/change-style-svgrepo-com.svg"
import SVGddoublecheck from "/src/assets/svg/double-check-svgrepo-com.svg"
import SVGaccount from "/src/assets/svg/account-svgrepo-com.svg"
import SVGdelete from "/src/assets/svg/close-circle-svgrepo-com.svg"


const EditProfileSettings = ({ userData }) => {
    const { setUserData, setPopUp, setModal } = useContext( ChatBoxApiContext )

    const flexEditErrorController = (value, item) => {
            if (item.key == "email") {
                const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
                if (regex.test(value)) {
                    return false // return false if the value is fine
                }else{
                    setPopUp({ message: "Your email must be a convenient one"} )
                    return true //return true you want to stop the action
                }
            }
            return false
    }

    const handleChangeSingleFieldInBDD = async ({ id, key, value}) => {
        try{
            await axios.patch('http://localhost:3000/users/', { id, key, value})
            if(setUserData){
                setUserData(( previous )=> ({
                    ...previous,
                    [key]: value
                }))
            }
        }catch(err){
            console.log("Something went wrong : ", err)
        }
    }

    return ( 
        <div className={styles.container}>
            <div className={styles.header}>
                    {
                        [
                         {
                            key: "name",
                            title: "Name",
                            value: userData.name,
                         }, 
                         {
                            key:"pseudo",
                            title: "Pseudo",
                            value: userData?.pseudo ?? "..."
                         },
                         {
                            key:"email",
                            title: "Email",
                            value: userData.email
                         },
                         {
                            key: "number",
                            title: "Phone number",
                            value: userData.number ?? "..."
                         }
                        ].map(
                            (item, key) => (
                            <FlexEdit 
                                key={key} title={item.title} 
                                defaultValue={item.value}
                                callback={(value)=>{
                                    handleChangeSingleFieldInBDD({
                                        id: userData?.id,
                                        key: item.key,
                                        value: value,
                                    })
                                }}
                                errorController= {(value)=>{
                                   return flexEditErrorController(value,item)
                                }}
                            />)
                        )
                    }
            </div>
            <div className={styles.options}>
                <ViewOption 
                        title="Description"
                        leading={SVGabout}
                        description="What do you usually do ?"
                        onClick={()=> {
                            setModal({open: true, ModalComponent: ()=> <FlexEdit
                                                    title="Description"
                                                    resize="none"
                                                    placeholder = {userData.description == "" ? "Void description" : undefined}
                                                    defaultValue= {userData?.description}
                                                    containerStyle={{
                                                        backgroundColor: "black",
                                                        height: "100%", 
                                                        width: "500px"
                                                    }}
                                                    textareaStyle= {{
                                                        resize: ""
                                                    }}
                                                    callback={(value)=>{
                                                        handleChangeSingleFieldInBDD({
                                                            id: userData?.id,
                                                            key: "description",
                                                            value: value,
                                                        })
                                                    }}
                            /> })
                        }}
                />
                <ViewOption 
                        title="Disponibile"
                        leading={SVGdisponibility}
                        description="Tell everyone if you are disponible"
                >
                    <Switch 
                        defaultValue={userData?.availability}
                        callback={(state)=>{
                            handleChangeSingleFieldInBDD({
                                id: userData?.id,
                                key: "availability",
                                value: +state,
                            })
                        }}
                    />
                </ViewOption>
                <ViewOption
                        title="Visible"
                        leading={SVGdvisibility}
                        description="Allow us to show you at the global user invit list"
                >
                    <Switch 
                        defaultValue={userData?.visibility}
                        callback={(state)=>{
                            handleChangeSingleFieldInBDD(          {
                                id: userData?.id,
                                key: "visibility",
                                value: +state,
                            })
                        }}
                    />
                </ViewOption>
                <ViewOption
                        title="Change password"
                        leading={SVGdchange}
                        description="Here change your password if needed"
                        onClick={()=>{
                            setModal({open: true, ModalComponent: ()=> 
                                (
                                    <FlexEdit 
                                        title="Change password"
                                        resize="none"
                                        placeholder = "New password"
                                        containerStyle={{
                                            backgroundColor: "black",
                                            height: "100%", 
                                            width: "500px"
                                        }}
                                        textareaStyle= {{
                                            resize: ""
                                        }}
                                        callback={(value)=>{
                                            handleChangeSingleFieldInBDD({
                                                id: userData?.id,
                                                key: "password",
                                                value: value,
                                            })
                                        }}
                                    />
                                )}
                            )
                        }}
                />
                <ViewOption
                        title="Change Key Friend"
                        leading={SVGdchange}
                        description="A key friend is a tool that allow user to directly acces to ..."
                        onClick={()=>{
                            setModal({open: true, ModalComponent: () => <FlexEdit 
                                                        title="Change Key Friend"
                                                        resize="none"
                                                        placeholder = "New Key Friend"
                                                        containerStyle={{
                                                            backgroundColor: "black",
                                                            height: "100%", 
                                                            width: "500px"
                                                        }}
                                                        textareaStyle= {{
                                                            resize: ""
                                                        }}
                                                        callback={(value)=>{
                                                            handleChangeSingleFieldInBDD({
                                                                id: userData?.id,
                                                                key: "keyFriend",
                                                                value: value,
                                                            })
                                                        }}
                                                    />
                        })
                        }}
                />
                <ViewOption
                        title="Checking by double facteurs"
                        leading={SVGddoublecheck}
                        description="Use double factor authentification for important purpose"
                >
                    <Switch 
                        defaultValue={userData?.doubleAuthentification}
                        callback={(state)=>{
                            handleChangeSingleFieldInBDD({
                                id: userData?.id,
                                key: "doubleAuthentification",
                                value: +state,
                            })
                        }}
                    />
                </ViewOption>
                <ViewOption
                        title="Add a new account"
                        leading={SVGaccount}
                        description=""
                        onClick={()=>{
                            setModal({open: true, styleContent: {backgroundColor: "transparent"}, ModalComponent: () => 
                            (
                                <ChatBoxForm
                                     url="http://localhost:3000/users/login"
                                     btnContent = "Add new account"
                                     formStyle={{
                                         width: "fit-content",
                                         minHeight: "0px"
                                     }}
                                >
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
                                </ChatBoxForm>
                             )})
                        }}
                />
                <ViewOption
                        title="Delete my account"
                        leading={SVGdelete}
                        description="This action can't be undone..."
                        onClick={()=>{
                            setModal({
                                open: true,
                                showCancelAndConfirmButtons: true,
                                onContinueHandler: () => {},
                                ModalComponent: ()=>( 
                                    <p style={{color: "red", fontSize: 17}}>
                                     This action can&apos;t be undone 
                                    </p>
                                )
                            })
                        }}
                />
            </div>
        </div>
     );
}

EditProfileSettings.propTypes = {
    userData: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string.isRequired,
        pseudo: PropTypes.string,
        email: PropTypes.string,
        description: PropTypes.string,
        number: PropTypes.string,
        password: PropTypes.string,
        doubleAuthentification: PropTypes.number,
        availability: PropTypes.number,
        visibility: PropTypes.number
    }).isRequired,
} 
 
export default EditProfileSettings;