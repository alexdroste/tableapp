import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as desktopAppActions from '../actions/desktopApp';
import * as notificationsActions from '../actions/notifications';
import * as qs from 'query-string';
import { withRouter, Route, Switch, Redirect, Link } from 'react-router-dom';
import { getConnectionState } from '../reducers/api';
import { LoginStateEnum, getLoginState, hasAcceptedTos, getLastActiveEventId } from '../reducers/user';
import { ApiConnectionStateEnum } from '../api/ApiConnectionStateEnum';
import { UserLoginView } from './UserLoginView';
import { ApiDisconnectedView } from '../components/ApiDisconnectedView';
import { AllEventsView } from './AllEventsView';
import { SwitchEventView } from './SwitchEventView';
import { SettingsView } from './SettingsView';
import { EventWrapper } from './EventWrapper';
import { AcceptTosView } from './AcceptTosView';
import { LegalInfosPage } from '../components/LegalInfosPage';
import { TitleBar } from '../components/TitleBar';
import { isDesktopApp, isMiniControlViewActive } from '../reducers/desktopApp';
import { WebFrameScaler } from '../WebFrameScaler';
import { ScreenBroadcastHelper } from './ScreenBroadcastHelper';


const ContentWrapper = styled.div`
    position: relative;
    max-width: 600px;
    padding: 0 10px 75px 10px;
    margin: 0 auto;
`;


const CenteredP = styled.p`
    margin-top: 2em;
    text-align: center;
`;


/**
 * Toplevel routing view.
 * 
 * __Exported component is connected to router.__
 * __Exported component is connected to redux-store. Some props are injected by HOC.__
 * @param {object} props
 * @param {boolean} props.apiDisconnected indicates if api is currently disconnected (injected by redux)
 * @param {object} props.desktopAppActions object containing bound desktopAppAction (injected by redux)
 * @param {object} props.history object containing history (injected by router)
 * @param {boolean} props.isDesktopApp indicates if client is run as desktop-app
 * @param {boolean} props.userHasAcceptedTos indicates if user has accepted terms of service
 * @param {boolean} props.userLoggedIn indicates if user is logged in (injected by redux)
 */
class App extends React.Component {
    static get propTypes() {
        return {
            apiDisconnected: PropTypes.bool.isRequired,
            desktopAppActions: PropTypes.object.isRequired,
            history: PropTypes.object.isRequired,
            isDesktopApp: PropTypes.bool.isRequired,
            userHasAcceptedTos: PropTypes.bool.isRequired,
            userLoggedIn: PropTypes.bool.isRequired,
        };
    };

    static get defaultProps() {
        return {};
    };


    /**
     * Lifecycle that checks for electron context.
     * @function
     */
    UNSAFE_componentWillMount() {
        if (window.electron) { // if window.electron is set => desktop app
            const wfs = new WebFrameScaler();
            wfs.setZoomLevel(1.0); // reset zoom on start
            this.props.desktopAppActions.initDesktopApp();
            this.props.history.replace('/');
        }
    }


    componentDidMount() {
        this._readNotification();
    }


    componentDidUpdate() {
        this._readNotification();
    }

    _lastNId = undefined;
    _readNotification = () => {
        const o = qs.parse(this.props.location.search);
        if (o.nId === undefined || this._lastNId === o.nId)
            return;
        this._lastNId = o.nId;
        this.props.notificationsActions.readNotification(o.nId, false);
    };


    /**
     * Renders content.
     * @function
     * @private
     */
    _renderContent() {
        const {apiDisconnected, userHasAcceptedTos, lastActiveEventId, userLoggedIn} = this.props;

        if (apiDisconnected)
            return (
                <ApiDisconnectedView/>
            );

        if (!userLoggedIn)
            return (
                <UserLoginView/>                
            );
        
        if (!userHasAcceptedTos)
            return (
                <AcceptTosView/>
            );

        return ( 
            <Switch>
                <Route exact path='/' render={() => (
                    lastActiveEventId ? (
                        <Redirect to={`/${lastActiveEventId}`}/>
                    ) : (
                        <Redirect to='/switchevent'/>
                    )
                )}/>
                <Route path='/searchevents' component={AllEventsView}/>
                <Route path='/switchevent' component={SwitchEventView}/>
                <Route path='/settings' component={SettingsView}/>
                <Route path='/:eventId' component={EventWrapper}/>
            </Switch>
        );
    }


    render() {
        const { isDesktopApp, isMiniControlViewActive } = this.props;
        const renderLegalInfosLink = !isMiniControlViewActive;

        return (
            <ContentWrapper id="contentWrapper">
                {isDesktopApp &&
                    <TitleBar/>
                }
                <Switch>
                    <Route exact path='/legalinfos' component={LegalInfosPage}/>
                    <Route path='*' render={() => this._renderContent()}/>
                </Switch>
                {renderLegalInfosLink &&
                    <CenteredP>
                        <Link to='/legalinfos'>
                            Impressum / Datenschutz / Nutzungsbedingungen
                        </Link>
                    </CenteredP>
                }
                {isDesktopApp && 
                    <ScreenBroadcastHelper/>
                }
            </ContentWrapper>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        apiDisconnected: getConnectionState(state.api) === ApiConnectionStateEnum.DISCONNECTED,
        userHasAcceptedTos: hasAcceptedTos(state.user),
        isDesktopApp: isDesktopApp(state.desktopApp),
        isMiniControlViewActive: isMiniControlViewActive(state.desktopApp),
        lastActiveEventId: getLastActiveEventId(state.user),
        userLoggedIn: getLoginState(state.user) === LoginStateEnum.LOGGED_IN,
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        desktopAppActions: bindActionCreators(desktopAppActions, dispatch),
        notificationsActions: bindActionCreators(notificationsActions, dispatch),
    };
}


const ConnectedApp = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
export { ConnectedApp as App };
