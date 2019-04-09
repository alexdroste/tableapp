import React from 'react';
import { connect } from 'react-redux';
import { Header } from 'semantic-ui-react'; 
import { NavBar } from './NavBar';
import { getActiveEventUserPermissionLevel } from '../reducers/events';
import { PermissionLevelEnum } from '../PermissionLevelEnum';
import { UserEventSettings } from './UserEventSettings';
import { UserSettings } from './UserSettings';


class SettingsView extends React.Component {
    /**
     * 
     */
    static get propTypes() {
        return {
            
        };
    };

    static get defaultProps() {
        return {};
    };


    render() {
        const { eventId } = this.props.match.params;

        /*
        Zeige immer:
        - Einstellungen zum user

        Wenn /:eventId/settings
        - Zeige aktuelle Veranstaltung
        - Zeige Einstellungen zu aktueller Veranstalung

        Wenn 'canManage'-Rechte, Zeige Button zur Veranstaltungsverwaltung


        */


        return (
            <div>
                <NavBar
                    hasGoBack
                    mainContent={"Einstellungen"}
                />
                {eventId && 
                    <div>
                        <UserEventSettings/>
                        <br/>
                    </div>
                }
                <UserSettings/>
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
    };
}


const ConnectedSettingsView = connect(mapStateToProps, mapDispatchToProps)(SettingsView);
export { ConnectedSettingsView as SettingsView };