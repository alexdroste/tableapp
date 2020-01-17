import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Button, Modal } from 'semantic-ui-react';
import * as userActions from '../actions/user';
import { getUserId } from '../reducers/user';
import { getActiveEventId } from '../reducers/events';
import { withRouter } from 'react-router-dom';
import * as qs from 'query-string';


const surveyId = 'post-ws1920-a';
const surveyDeadline = new Date('2020-02-16');


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

    componentDidMount() {
        this._handleDone();
    }

    componentDidUpdate() {
        this._handleDone();
    }


    _handleDone = (e) => {
        const o = qs.parse(this.props.location.search);
        if (o.extSurveyIdDone === undefined || this.props.extSurveys.includes(surveyId) || o.extSurveyIdDone !== surveyId)
            return;
        this.props.userActions.addExtSurveyIdDone(surveyId);
    };


    _handleOpen = url => () => {
        window.location = url;
    };


    render() {
        const { activeEventId, extSurveys, userId } = this.props;

        if (extSurveys.includes(surveyId) || new Date() > surveyDeadline)
            return null;

        const url = `https://survey.progmem.de/index.php/37423?userId=${userId}&eventId=${activeEventId}&newtest=Y`;

        return (
            <Card fluid color='red'>
                <Card.Content>
                    <Card.Header>Huhu!</Card.Header>
                    <Card.Description>
                        <p>
                        Wir brauchen nochmal deine Hilfe.
                        </p>
                        <p>
                        Wie angekündigt gibt es jetzt zum Ende des Semesters noch eine zweite Umfrage.
                        Bitte fülle die nachfolgende (kurze) Umfrage aus,
                        um uns dabei zu helfen, das System zu optimieren und dem Ziel näher zu kommen,
                        unsere Lehre zu verbessern.
                        Ohne deine Teilnahme ist das nicht möglich.
                        </p>
                        <p>
                        gez. Alexander D., Entwickler, Institut für Informatik, Human-Centered Information Systems
                        </p>
                        <Button
                            content='Umfrage starten (3 min)'
                            positive
                            onClick={this._handleOpen(url)}
                        />
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


const ConnectedExtSurveyPrompt = withRouter(connect(mapStateToProps, mapDispatchToProps)(ExtSurveyPrompt));
export { ConnectedExtSurveyPrompt as ExtSurveyPrompt };