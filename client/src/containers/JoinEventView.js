import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Header, Segment, Button, List } from 'semantic-ui-react';
import * as eventsActions from '../actions/events';
import { getActiveEventName, getActiveEventId } from '../reducers/events';
import { NavBar } from './NavBar';


const ButtonGroupMargin = styled.div`
    & {
        margin-top: 1em;
    }

    &&& > button {
        margin-top: .5em;
    }
`;


class JoinEventView extends React.Component {
    static get propTypes() {
        return {};
    };

    static get defaultProps() {
        return {};
    };

    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }


    _handleJoinClick = (e) => {
        this.props.eventsActions.joinEvent(this.props.activeEventId);
    };


    render() {
        const { activeEventName } = this.props;

        return (
            <div>
                <NavBar
                    hasGoBack
                />
                <Header content='Veranstaltung beitreten'/>
                <Segment>
                    <Header as='h3'>{activeEventName}</Header>
                    <div>
                        Um die Inhalte der Veranstaltung "{activeEventName}" anzuzeigen, musst du der Veranstaltung beitreten.
                        Nach dem Beitritt ist es dir möglich:
                        <List bulleted>
                            <List.Item>Beitrage und Diskussion anzuzeigen</List.Item>
                            <List.Item>Beiträge und Kommentare zu verfassen</List.Item>
                            <List.Item>Auf Inhalte zu reagieren</List.Item>
                            <List.Item>Benachrichtigungen über neue Inhalte zu erhalten</List.Item>
                        </List>
                    </div>
                    <ButtonGroupMargin>
                        <Button
                            content='Veranstaltung beitreten'
                            color='green'
                            fluid
                            icon='user'
                            onClick={this._handleJoinClick}
                        />
                    </ButtonGroupMargin>
                </Segment>
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        activeEventId: getActiveEventId(state.events),
        activeEventName: getActiveEventName(state.events),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        eventsActions: bindActionCreators(eventsActions, dispatch),
    };
}


const ConnectedJoinEventView = connect(mapStateToProps, mapDispatchToProps)(JoinEventView);
export { ConnectedJoinEventView as JoinEventView };