import React from 'react';
import { connect } from 'react-redux';
import { Header } from 'semantic-ui-react'; 
import { NavBar } from './NavBar';
import { getActiveEventUserPermissionLevel, getActiveEventId } from '../reducers/events';
import { PermissionLevelEnum } from '../PermissionLevelEnum';
import { EventItem } from './EventItem';


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
        const {activeEventId} = this.props;
        return (
            <div>
                <NavBar
                    hasGoBack
                    mainContent={"Einstellungen"}
                />
                <Header content="Einstellungen"/>
                <EventItem 
                    contentBefore={
                        <Header content="Aktuelle Veranstaltung"/>
                    }
                    eventId={activeEventId}
                />
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        activeEventId: getActiveEventId(state.events),
        userCanManageActiveEvent: getActiveEventUserPermissionLevel(state.events) >= PermissionLevelEnum.ADMINISTRATOR,
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
    };
}


const ConnectedSettingsView = connect(mapStateToProps, mapDispatchToProps)(SettingsView);
export { ConnectedSettingsView as SettingsView };