
import axios from "axios"
import PropTypes from 'prop-types';
import { useContext, useCallback, useState } from 'react';
import { ChatBoxApiContext } from '/src/context/context';

import ChatBoxForm from "/src/components/ui/form/form";
import Input from "/src/components/ui/input/input";
import Switch from "/src/components/ui/switch/switch"
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
import Modal from "/src/components/ui/modal/modal";


const EditProfileSettings = ({ userData, baseApiURL }) => {

    const { setUserData, setPopUp } = useContext( ChatBoxApiContext )
    const [ ModalManager, setModalManger ] = useState({ args: null, children: null })

    const handleChangeSingleFieldInBDD = useCallback(async ({ id, key, value }) => {
        if (!id || !key) return;
        
        try {
          await axios.patch(`${baseApiURL.current}/users/`, { id, key, value });
    
          setUserData?.((previous) => {
            if (previous[key] === value) return previous;
            return {
              ...previous,
              [key]: value,
            };
          });
        } catch (err) {
          console.error("Something went wrong : ", err);
        }
      }, [setUserData]);
      

    
      const flexEditErrorController = useCallback((value, item) => {
        if (item.key === "email") {
          const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
          if (!regex.test(value)) {
            setPopUp?.({ message: "Your email must be a convenient one" });
            return true;
          }
        } else if (item.key === "pseudo" || item.key === "name") {
          if (value.trim() === "") {
            setPopUp?.({ message: "You must correctly fill the field for updating your data" });
            return true;
          }
        }
        return false;
      }, [setPopUp]);



    const fieldToArrayEdit = [
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
       ]

    return ( 
        <div className={styles.container}>
            <div className={styles.header}>
                    {
                        fieldToArrayEdit.map(
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
                            setModalManger({
                                args: { open: true },
                                children: ()=> <FlexEdit
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
                            setModalManger({ 
                                args: { open: true }, 
                                children: ()=> 
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
                            setModalManger({
                                args: { open: true }, 
                                children: () => <FlexEdit 
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
                            setModalManger({ 
                                args: { open: true, styleContent: {backgroundColor: "transparent"} } ,
                                children: () => 
                            (
                                <ChatBoxForm
                                     url={`${baseApiURL.current}/users/login`}
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
                            setModalManger({
                                args:{  open: true,
                                        showCancelAndConfirmButtons: true,
                                        onContinueHandler:async  () => {
                                            try{
                                                await axios.delete(`${baseApiURL.current}/users/delete/${userData.id}`)
                                                localStorage.clear()
                                                window.location.reload()
                                            }
                                            catch(err){
                                                console.log("Something went wrong while deleting user, err: ", err)
                                            }
                                        }
                                    },
                                children: ()=>( 
                                    <p style={{color: "red", fontSize: 17}}>
                                     This action can&apos;t be undone 
                                    </p>
                                )
                            })
                        }}
                />
            </div>
            {
                ModalManager.args && ModalManager.children && (
                    <Modal
                        { ...ModalManager.args }
                        onClose={()=>{
                            if(ModalManager.args?.onClose) ModalManager.args.onClose()
                            setModalManger({args: null, children: null})
                        }}
                    >
                        <ModalManager.children />
                    </Modal>
                )
            }
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