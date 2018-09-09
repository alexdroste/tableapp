import React from 'react';
import { connect } from 'react-redux';
import { Header } from 'semantic-ui-react';
import { DefineRolesForm } from './DefineRolesForm';
import { ManageRolesForm } from './ManageRolesForm';
import { ManageEventNameForm } from './ManageEventNameForm';
import { ManageEventModulesForm } from './ManageEventModulesForm';
import { NavBar } from './NavBar';


class EventSettingsView extends React.Component {
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
        return (
            <div>
                <NavBar
                    hasGoBack
                    hideNavigation
                    mainContent="Veranstaltung verwalten"
                />
                <Header content="Veranstaltung"/>
                <ManageEventNameForm/>
                <ManageEventModulesForm/>
                <DefineRolesForm/>
                <ManageRolesForm/>
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        // TODO
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
    };
}


const ConnectedEventSettingsView = connect(mapStateToProps, mapDispatchToProps)(EventSettingsView);
export { ConnectedEventSettingsView as EventSettingsView };