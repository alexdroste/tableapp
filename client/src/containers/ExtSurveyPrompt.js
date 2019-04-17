import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Button, Modal } from 'semantic-ui-react';
import * as userActions from '../actions/user';
import { getUserId } from '../reducers/user';
import { getActiveEventId } from '../reducers/events';


const surveyId = 'pre-1-a';


const CustomContent = styled(Modal.Content)`
    &&&&& {
        padding: 0 !important;
    }
`;


const ParticipatedDiv = styled.div`
    font-size: 10px;
    color: #777;
    cursor: pointer;
    margin-top: -14px;
`;


// extra-code for surveys
class ExtSurveyPrompt extends React.Component {
    static get propTypes() {
        return {};
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
            open: false,
        };
    }


    componentDidMount() {
        window.addEventListener('message', this._handleIframeMessage, false);
    }


    componentWillUnmount() {
        window.removeEventListener('message', this._handleIframeMessage, false);
    }


    _handleIframeMessage = (e) => {
        if (e.data !== 'survey_table_done_event')
            return;
        this.setState({ open: false });
        this.props.userActions.addExtSurveyIdDone(surveyId);
    };


    _handleOpen = () => this.setState({ open: true });


    _handleClose = () => this.setState({ open: false });


    _handleDone = () => {
        this.setState({ open: false });
        this.props.userActions.addExtSurveyIdDone(this.sId);
    };


    render() {
        const { activeEventId, extSurveys, userId } = this.props;
        const { open } = this.state;

        if (extSurveys.includes(surveyId))
            return null;

        const url = `https://survey.progmem.de/index.php/767942?userId=${userId}&eventId=${activeEventId}&newtest=Y`;

        return (
            <Card fluid color='red'>
                <Card.Content>
                    <Card.Header>Schau her!</Card.Header>
                    <Card.Description>
                        <p>
                        Ich brauche deine Hilfe.
                        </p>
                        <p>
                        Bitte fülle meine nachfolgende (kurze) Umfrage aus,
                        um mir dabei zu helfen, das System zu verbessern und dem Ziel näher zu kommen,
                        es bald TU-weit einsetzen zu können.
                        Ohne deine Teilnahme ist das nicht möglich.
                        </p>
                        <p>
                        gez. Alexander D., Entwickler, HCIS
                        </p>
                        <Modal
                            basic
                            size='fullscreen'
                            trigger={
                                <Button
                                    content='Umfrage starten (3 min)'
                                    positive
                                    onClick={this._handleOpen}
                                />
                            }
                            closeIcon
                            open={open}
                            onClose={this._handleClose}
                        >
                            <CustomContent>
                                <ParticipatedDiv 
                                    onClick={this._handleDone}
                                >
                                    Bereits teilgenommen?
                                </ParticipatedDiv>
                                <iframe 
                                    src={url}
                                    style={{ width: '100%', height: '100%', minHeight: '80vh' }}
                                    title='limesurvey'
                                />
                            </CustomContent>
                        </Modal>
                    </Card.Description>
                </Card.Content>
            </Card>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        activeEventId: getActiveEventId(state.events),
        extSurveys: state.user.extSurveys, // extra-code for surveys
        userId: getUserId(state.user),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    };
}


const ConnectedExtSurveyPrompt = connect(mapStateToProps, mapDispatchToProps)(ExtSurveyPrompt);
export { ConnectedExtSurveyPrompt as ExtSurveyPrompt };