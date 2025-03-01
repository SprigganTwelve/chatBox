
import PropTypes from 'prop-types';
import Switch from "/src/components/ui/switch/Switch"
import FlexEdit from "/src/components/ui/flexEdit/flex.edit"
import ViewOption from "./components/viewOption/view.option";
import styles from "./edit.profile.settings.module.css"


const EditProfileSettings = ({ userData }) => {

    return ( 
        <div className={styles.container}>
            <div className={styles.header}>
                    {
                        [
                         {
                            title: "Name",
                            value: userData.name,
                         }, 
                         {
                            title: "Pseudo",
                            value: userData.pseudo
                         },
                         {
                            title: "Email",
                            value: userData.email
                         },
                         {
                            title: "Phone number",
                            value: userData.number ?? "..."
                         }
                        ].map(
                            (item, key) => <FlexEdit key={key} title={item.title} value={item.value} />
                        )
                    }
            </div>
            <div className={styles.options}>
                <ViewOption title="Description" description="What do you usually do ?" />
                <ViewOption title="Disponibile" description="Tell everyone if you are disponible">
                    <Switch />
                </ViewOption>
                <ViewOption title="Visible" description="Allow us to show you at the global user invit list">
                    <Switch />
                </ViewOption>
                <ViewOption title="Change password" description="Here change your password if needed" />
                <ViewOption title="Change Key Friend" description="A key friend is a tool that allow user to directly acces to ..." />
                <ViewOption title="Checking by double facteurs" description="Use double factor authentification for important purpose">
                    <Switch />
                </ViewOption>
                <ViewOption title="Add a new account" description="" />
                <ViewOption title="Delete my account" description="This action can't be undone..." />
            </div>
        </div>
     );
}

EditProfileSettings.propTypes = {
    userData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        pseudo: PropTypes.string,
        email: PropTypes.string,
        number: PropTypes.string,
    }).isRequired,
} 
 
export default EditProfileSettings;