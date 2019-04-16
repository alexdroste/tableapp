import React from 'react';
import { connect } from 'react-redux';
import { NavBar } from './NavBar';
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
    };
}


const ConnectedSettingsView = connect(mapStateToProps, mapDispatchToProps)(SettingsView);
export { ConnectedSettingsView as SettingsView };