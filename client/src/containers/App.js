import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as desktopAppActions from '../actions/desktopApp';
import { withRouter, Route, Switch, Redirect, Link } from 'react-router-dom';
import { isSwitchActiveEventPending, getActiveEventId } from '../reducers/events'; 
import { getConnectionState } from '../reducers/api';
import { LoginStateEnum, getLoginState, hasAcceptedTos } from '../reducers/user';
import { ApiConnectionStateEnum } from '../api/ApiConnectionStateEnum';
import { Container, Dimmer, Loader } from 'semantic-ui-react';
import { NotFoundView } from '../components/NotFoundView';
import { UserLoginView } from './UserLoginView';
import { ApiDisconnectedView } from '../components/ApiDisconnectedView';
import { JoinEventView } from './JoinEventView';
import { SwitchEventView } from './SwitchEventView';
import { ActiveEventView } from './ActiveEventView';
import { AcceptTosView } from './AcceptTosView';
import { LegalInfosPage } from '../components/LegalInfosPage';


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
 * @param {boolean} props.isActiveEventSet indicates if an event is selected and set active (injected by redux)
 * @param {boolean} props.isSwitchActiveEventPending indicates if currently switching active event (injected by redux)
 * @param {boolean} props.userHasAcceptedTos indicates if user has accepted terms of service
 * @param {boolean} props.userLoggedIn indicates if user is logged in (injected by redux)
 */
class App extends React.Component {
    static get propTypes() {
        return {
            apiDisconnected: PropTypes.bool.isRequired,
            desktopAppActions: PropTypes.object.isRequired,
            history: PropTypes.object.isRequired,
            isActiveEventSet: PropTypes.bool.isRequired,
            isSwitchActiveEventPending: PropTypes.bool.isRequired,
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
            this.props.desktopAppActions.initDesktopApp();
            this.props.history.replace('/');
        }
    }


    /**
     * Renders content.
     * @function
     * @private
     */
    _renderContent() {
        const {apiDisconnected, isActiveEventSet, isSwitchActiveEventPending, 
            userHasAcceptedTos, userLoggedIn} = this.props;

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

        if (isSwitchActiveEventPending)
            return (
                <Dimmer
                    active
                    page
                    inverted
                >
                    <Loader inverted/>
                </Dimmer>
            )

        if (!isActiveEventSet)
            return ( 
                <Switch>
                    <Route exact path='/' render={() => (
                        <Redirect to='/switchevent'/>
                    )}/>
                    <Route path='/join/:eventId' component={JoinEventView}/>
                    <Route path='/join' component={JoinEventView}/>
                    <Route path='/switchevent' component={SwitchEventView}/>
                    <Route path="*" component={NotFoundView} status={404}/>                    
                </Switch>
            );
        
        return (
            <ActiveEventView/>
        );
    }


    render() {
        return (
            <ContentWrapper id="contentWrapper">
                <Switch>
                    <Route exact path='/legalinfos' component={LegalInfosPage}/>
                    <Route path='*' render={() => this._renderContent()}/>
                </Switch>
                <CenteredP>
                    <Link to='/legalinfos'>
                        Impressum / Datenschutz / Nutzungsbedingungen
                    </Link>
                </CenteredP>
            </ContentWrapper>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        apiDisconnected: getConnectionState(state.api) === ApiConnectionStateEnum.DISCONNECTED,
        userHasAcceptedTos: hasAcceptedTos(state.user),
        isActiveEventSet: !!getActiveEventId(state.events),
        isSwitchActiveEventPending: isSwitchActiveEventPending(state.events),
        userLoggedIn: getLoginState(state.user) === LoginStateEnum.LOGGED_IN,
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        desktopAppActions: bindActionCreators(desktopAppActions, dispatch),
    };
}


const ConnectedApp = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
export { ConnectedApp as App };
