
import axios from "axios"
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { ChatBoxApiContext } from '../../../context/context';
import Switch from "/src/components/ui/switch/Switch"
import FlexEdit from "/src/components/ui/flexEdit/flex.edit"
import ViewOption from "./components/viewOption/view.option";
import styles from "./edit.profile.settings.module.css"
import SVGabout from "/src/assets/svg/about-filled-svgrepo-com.svg"
import SVGdisponibility from "/src/assets/svg/telephone-line-24-hours-service-svgrepo-com.svg"
import SVGdvisibility from "/src/assets/svg/visibility-svgrepo-com.svg"
import SVGdchange from "/src/assets/svg/change-style-svgrepo-com.svg"
import SVGddoublecheck from "/src/assets/svg/double-check-svgrepo-com.svg"
import SVGaccount from "/src/assets/svg/account-svgrepo-com.svg"
import SVGdelete from "/src/assets/svg/close-circle-svgrepo-com.svg"


const EditProfileSettings = ({ userData }) => {
    const { setError } = useContext( ChatBoxApiContext )
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
                                    console.log(`http://localhost:3000/users/${userData?.id}/${item.key}/${value}`)
                                    axios.patch(`http://localhost:3000/users/${userData?.id}/${item.key}/${value}`)
                                }}
                                errorController= {(value) => {
                                    if (item.key == "email") {
                                        //TODO: IMPLEMENT
                                    }
                                    return null
                                } }
                            />)
                        )
                    }
            </div>
            <div className={styles.options}>
                <ViewOption 
                        title="Description"
                        leading={SVGabout}
                        description="What do you usually do ?"
                />
                <ViewOption 
                        title="Disponibile"
                        leading={SVGdisponibility}
                        description="Tell everyone if you are disponible"
                >
                    <Switch 
                        defaultValue={userData?.avaibility}
                        callback={(state)=>{
                            axios.patch(`http://localhost:3000/users/${userData?.id}/avaibility/${+state}`)
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
                            axios.patch(`http://localhost:3000/users/${userData?.id}/visibility/${+state}`)
                        }}
                    />
                </ViewOption>
                <ViewOption
                        title="Change password"
                        leading={SVGdchange}
                        description="Here change your password if needed"
                />
                <ViewOption
                        title="Change Key Friend"
                        leading={SVGdchange}
                        description="A key friend is a tool that allow user to directly acces to ..."
                />
                <ViewOption
                        title="Checking by double facteurs"
                        leading={SVGddoublecheck}
                        description="Use double factor authentification for important purpose"
                >
                    <Switch 
                        defaultValue={userData?.doubleAuthentification}
                        callback={(state)=>{
                            axios.patch(`http://localhost:3000/users/${userData?.id}/doubleAuthentification/${+state}`)
                        }}
                    />
                </ViewOption>
                <ViewOption
                        title="Add a new account"
                        leading={SVGaccount}
                        description=""
                />
                <ViewOption
                        title="Delete my account"
                        leading={SVGdelete}
                        description="This action can't be undone..."
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
        number: PropTypes.string,
        doubleAuthentification: PropTypes.number,
        avaibility: PropTypes.number,
        visibility: PropTypes.number
    }).isRequired,
} 
 
export default EditProfileSettings;