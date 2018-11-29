import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as entriesActions from '../actions/entries';
import { PollsView } from './PollsView';
import { CommentsView } from './CommentsView';
import { EntriesView } from './EntriesView';
import { SettingsView } from './SettingsView';
import { UserPostView } from './UserPostView';
import { NotFoundView } from '../components/NotFoundView';
import { SwitchEventView } from './SwitchEventView';
import { JoinEventView } from './JoinEventView';
import { DynamicRowsCache } from '../DynamicRowsCache';
import { isMiniControlViewActive, isDesktopApp } from '../reducers/desktopApp';
import { MiniControlView } from './MiniControlView';
import { EventSettingsView } from './EventSettingsView';
import { ScreenBroadcastHelper } from './ScreenBroadcastHelper';
import { getActiveEventUserPermissionLevel } from '../reducers/events';
import { PermissionLevelEnum } from '../PermissionLevelEnum';
import { LastScreenshotThumbnail } from './LastScreenshotThumbnail';


/**
 * Main routing view, if active event is selected.
 * 
 * __Exported component is connected to router.__
 * __Exported component is connected to redux-store. Some props are injected by HOC.__
 * @param {object} props
 * @param {object} props.entriesActions object containing bound entriesActions (injected by redux)
 * @param {boolean} props.isDesktopApp indicates if app is running in electron environment (injected by redux)
 * @param {boolean} props.userCanManageActiveEvent indicates if user can manage the active event (injected by redux)
 */
class ActiveEventView extends React.Component {
    static get propTypes() {
        return {
            entriesActions: PropTypes.object.isRequired,
            isDesktopApp: PropTypes.bool.isRequired,
            userCanManageActiveEvent: PropTypes.bool.isRequired,
        };
    };

    static get defaultProps() {
        return {};
    };

    // static get contextTypes() {
    //     return {
    //         router: PropTypes.object.isRequired
    //     };
    // }


    constructor(props) {
        super(props);

        /**
         * Rows cache for entries view
         * @type {DynamicRowsCache}
         * @private
         */
        this._entriesViewDynamicRowsCache = new DynamicRowsCache();
    }
    
    
    /**
     * Lifecycle that unsubscribes entry list.
     * @function
     */
    componentWillUnmount() {
        this.props.entriesActions.unsubscribeEntryList();
    }


    render() {
        const { isDesktopApp, isMiniControlViewActive, userCanManageActiveEvent } = this.props;

        return (
            <div>
                { isDesktopApp && isMiniControlViewActive ? (
                    <MiniControlView/>
                ) : (
                    <Switch>
                        <Route exact path="/" render={() => (
                            <Redirect to="/entries"/>
                        )}/>
                        <Route path="/entries/:entryId/:commentId/new" component={UserPostView}/>,
                        <Route path="/entries/:entryId" component={CommentsView}/>,
                        <Route path="/entries" render={() => <EntriesView dynamicRowsCache={this._entriesViewDynamicRowsCache} />}/>,
                        <Route path="/polls" component={PollsView}/>,
                        <Route path="/settings" component={SettingsView}/>
                        {userCanManageActiveEvent &&
                            <Route path="/eventsettings" component={EventSettingsView}/>
                        }
                        <Route path='/join/:eventId' component={JoinEventView}/>
                        <Route path='/join' component={JoinEventView}/>
                        <Route path='/switchevent' component={SwitchEventView}/>
                        <Route path="*" component={NotFoundView} status={404}/>
                    </Switch>
                )}
                {isDesktopApp && 
                    <ScreenBroadcastHelper/>
                }
                {isDesktopApp && !isMiniControlViewActive &&
                    <LastScreenshotThumbnail 
                        asOverlay={true}
                    />
                }
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        isDesktopApp: isDesktopApp(state.desktopApp),
        isMiniControlViewActive: isMiniControlViewActive(state.desktopApp),
        userCanManageActiveEvent: getActiveEventUserPermissionLevel(state.events) >= PermissionLevelEnum.ADMINISTRATOR,
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        entriesActions: bindActionCreators(entriesActions, dispatch),
    };
}


const ConnectedActiveEventView = withRouter(connect(mapStateToProps, mapDispatchToProps)(ActiveEventView));
export { ConnectedActiveEventView as ActiveEventView };