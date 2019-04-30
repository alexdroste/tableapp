import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as utils from '../utils';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as userActions from '../actions/user';
import { LoginStateEnum, getSessionToken, getLoginState } from '../reducers/user';
import { Button, Form, Input, Message, Segment, Header, Dimmer, Loader } from 'semantic-ui-react';
import { Logo } from '../components/Logo';


const Wrapper = styled.div`
    min-height: 75vh;
    display: flex;
    flex-direction: column;
    justify-content: center;

    & > div {
        width: 100%;
    }
`;

const LoginFormWrapper = styled.div`
    display: flex;
    justify-content: center;

    && > * {
        max-width: 400px;
        flex: 1 1 auto;
    }
`;


class UserLoginView extends React.Component {
    static get propTypes() {
        return {};
    };

    static get defaultProps() {
        return {};
    };


    constructor(props) {
        super(props);

        this.state = {
            auth: '',
            password: '',
        };
    }


    static getDerivedStateFromProps(nextProps) {
        // try to continue session automatically if sessionToken is set
        if (nextProps.sessionToken && nextProps.loginState === LoginStateEnum.LOGGED_OUT)
            nextProps.userActions.continueSession(nextProps.sessionToken);
        return null;
    }


    handleAuthChange = (e, data) => {
        this.setState({
            auth: data.value
        });
    };


    handleKeyPress = (e) => {
        if (e.key === 'Enter')
            this.handleSubmit();
    };


    handlePasswordChange = (e, data) => {
        this.setState({
            password: data.value
        });
    };


    handleSubmit = (e) => {
        let nAuth = this.state.auth;
        // allow login with uid by attaching @tu-clausthal.de if left
        if (!utils.isTextAnEmailAddress(nAuth)) {
            nAuth += '@tu-clausthal.de';
            this.setState({ 
                auth: nAuth 
            });
        }
        this.props.userActions.login(nAuth, this.state.password);
    };


    render() {
        const {loginState, sessionToken} = this.props;
        const {auth, password} = this.state;

        const isLoginPending = loginState === LoginStateEnum.PENDING;
        const hasLoginFailed = loginState === LoginStateEnum.FAILED;

        if (sessionToken)
            return (
                <Dimmer
                    active
                    page
                    inverted
                >
                    <Loader inverted/>
                </Dimmer>
            );

        return (
            <Wrapper>
                <div>
                    <Logo/>
                </div>
                <LoginFormWrapper>
                    <Segment>
                    <Form 
                        loading={isLoginPending}
                        error={hasLoginFailed}
                        onSubmit={this.handleSubmit}
                        onKeyPress={this.handleKeyPress}
                    >
                        <Form.Field>
                            <Header 
                                content="Anmelden"
                            />
                        </Form.Field>
                        <Form.Field 
                            error={hasLoginFailed}
                        >
                            <label>Email (oder RZ-Kürzel)</label>
                            <Input 
                                placeholder='TU-Login' 
                                type='text'
                                value={auth}
                                onChange={this.handleAuthChange}
                            />
                        </Form.Field>
                        <Form.Field 
                            error={hasLoginFailed}
                        >
                            <label>Passwort</label>
                            <Input 
                                placeholder='TU-Passwort' 
                                type='password'
                                value={password}
                                onChange={this.handlePasswordChange}
                            />
                        </Form.Field>
                        {hasLoginFailed &&
                            <Message
                                error
                                header="Anmeldung fehlgeschlagen"
                                content="Email und/oder Passwort sind nicht korrekt."
                            />
                        }
                        <Button 
                            primary 
                            fluid
                            icon="sign in"
                            content="Anmelden"
                            type="submit"
                        />
                    </Form>
                    </Segment>
                </LoginFormWrapper>
            </Wrapper>            
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        loginState: getLoginState(state.user),
        sessionToken: getSessionToken(state.user),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    };
}


const ConnectedUserLoginView = connect(mapStateToProps, mapDispatchToProps)(UserLoginView);
export { ConnectedUserLoginView as UserLoginView };