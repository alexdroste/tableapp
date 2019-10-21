import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as entriesActions from '../actions/entries';
import * as eventsActions from '../actions/events';
import { Dimmer, Loader } from 'semantic-ui-react';
import { EntriesView } from './EntriesView';
import { NotFoundView } from '../components/NotFoundView';
import { DynamicRowsCache } from '../DynamicRowsCache';
import { isMiniControlViewActive, isDesktopApp } from '../reducers/desktopApp';
import { MiniControlView } from './MiniControlView';
import { EventSettingsView } from './EventSettingsView';
import { isSwitchActiveEventPending, getActiveEventUserPermissionLevel, getSwitchActiveEventError } from '../reducers/events';
import { PermissionLevelEnum } from '../PermissionLevelEnum';
import { LastScreenshotThumbnail } from './LastScreenshotThumbnail';
import { SettingsView } from './SettingsView';
import { JoinEventView } from './JoinEventView';
import { EntryWrapper } from './EntryWrapper';


/**
 * Main routing view, if active event is selected.
 * 
 * __Exported component is connected to router.__
 * __Exported component is connected to redux-store. Some props are injected by HOC.__
 * @param {object} props
 * @param {object} props.entriesActions object containing bound entriesActions (injected by redux)
 * @param {boolean} props.isDesktopApp indicates if app is running in electron environment (injected by redux)
 * @param {boolean} props.isSwitchActiveEventPending indicates if currently switching active event (injected by redux)
 */
class EventWrapper extends React.Component {
    static get propTypes() {
        return {
            activeEventUserPermissionLevel: PropTypes.number,
            entriesActions: PropTypes.object.isRequired,
            isDesktopApp: PropTypes.bool.isRequired,
            isSwitchActiveEventPending: PropTypes.bool.isRequired,
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

        this.state = {
            /**
             * Indicates if render call is first one (during mounting).
             * Defaults to true.
             * @type {boolean}
             */
            isInitialRender: true,
        };

        /**
         * Rows cache for entries view
         * @type {DynamicRowsCache}
         * @private
         */
        this._entriesViewDynamicRowsCache = new DynamicRowsCache();
    }


    componentDidMount() {
        this.props.eventsActions.switchActiveEvent(this.props.match.params.eventId);
        this.setState({ isInitialRender: false });
    }


    componentDidUpdate(prevProps) {
        if (this.props.match.params.eventId !== prevProps.match.params.eventId)
            this.props.eventsActions.switchActiveEvent(this.props.match.params.eventId);
    }
    
    
    /**
     * Lifecycle that unsubscribes entry list.
     * @function
     */
    componentWillUnmount() {
        this.props.entriesActions.unsubscribeEntryList();
    }


    render() {
        const { activeEventUserPermissionLevel, isDesktopApp, isMiniControlViewActive, 
            isSwitchActiveEventPending, switchActiveEventError } = this.props;
        const userNotJoined = activeEventUserPermissionLevel < PermissionLevelEnum.USER;
        const userCanManageActiveEvent = activeEventUserPermissionLevel >= PermissionLevelEnum.ADMINISTRATOR;

        // For the first render-call always show Loader in order to
        // prevent components like EntriesView from mounting (and subscribing to 
        // entry-list for instance) BEFORE switchActiveEvent could be called in
        // componentDidMount (and therefore before isSwitchActiveEventPending 
        // could be set to true). This prevents race-conditions where e.g.
        // subscribeEntryList would be called before switchActiveEvent would be
        // complete. A bit of a mess, but it works.
        if (isSwitchActiveEventPending || this.state.isInitialRender)
            return (
                <Dimmer
                    active
                    page
                    inverted
                >
                    <Loader inverted/>
                </Dimmer>
            )

        if (switchActiveEventError)
            return (
                <Route path="*" component={NotFoundView} status={404}/>                    
            );

        if (userNotJoined)
            return (
                <JoinEventView/>
            );

        return (
            <div>
                { isDesktopApp && isMiniControlViewActive ? (
                    <MiniControlView/>
                ) : (
                    <Switch>
                        {userCanManageActiveEvent &&
                            <Route path="/:eventId/eventsettings" component={EventSettingsView}/>
                        }
                        <Route path='/:eventId/settings' component={SettingsView}/>
                        <Route path="/:eventId/:entryId" component={EntryWrapper}/>,
                        <Route path="/:eventId" render={() => 
                            <EntriesView 
                                dynamicRowsCache={this._entriesViewDynamicRowsCache}
                                eventId={this.props.match.params.eventId}
                            />
                        }/>,
                        {/* <Route path="/polls" component={PollsView}/>, */}
                    </Switch>
                )}
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
        activeEventUserPermissionLevel: getActiveEventUserPermissionLevel(state.events),
        isDesktopApp: isDesktopApp(state.desktopApp),
        isMiniControlViewActive: isMiniControlViewActive(state.desktopApp),
        isSwitchActiveEventPending: isSwitchActiveEventPending(state.events),
        switchActiveEventError: getSwitchActiveEventError(state.events),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        entriesActions: bindActionCreators(entriesActions, dispatch),
        eventsActions: bindActionCreators(eventsActions, dispatch),
    };
}


const ConnectedEventWrapper = withRouter(connect(mapStateToProps, mapDispatchToProps)(EventWrapper));
export { ConnectedEventWrapper as EventWrapper };