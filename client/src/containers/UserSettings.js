import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Header, Segment, Button, Form, Table, Checkbox } from 'semantic-ui-react';
import * as eventsActions from '../actions/events';
import { getActiveEventName, getActiveEventId, getActiveEventUserPermissionLevel } from '../reducers/events';
import { getUserRoleId } from '../reducers/eventInfo';
import { getUserId } from '../reducers/user';
import { RoleLabel } from './RoleLabel';
import { PermissionLevelEnum } from '../PermissionLevelEnum';
import { Confirm } from '../components/Confirm';


const ButtonGroupMargin = styled.div`
    & {
        margin-top: 1em;
    }

    &&& > button {
        margin-top: .5em;
    }
`;


const HorizontalList = styled.div`
    display: flex;
    align-items: center;
`;


class UserSettings extends React.Component {
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


    // constructor(props) {
    //     super(props);

    //     this.state = {
    //     };
    // }


    render() {
        const { activeEventId, activeEventName, userCanManageActiveEvent, userRoleId } = this.props;

        return (
            <div>
                <Header content="Account"/>
                <Segment>
                    <Header as='h3'>Benachrichtigungen</Header>
                    <Table basic='very' unstackable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={1}>In&#8209;App</Table.HeaderCell>
                                <Table.HeaderCell width={1}>Email</Table.HeaderCell>
                                <Table.HeaderCell width={14}></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <Checkbox/>
                                </Table.Cell>
                                <Table.Cell>
                                    <Checkbox/>
                                </Table.Cell>
                                <Table.Cell>Neuer Eintrag</Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell>
                                    <Checkbox/>
                                </Table.Cell>
                                <Table.Cell>
                                    <Checkbox/>
                                </Table.Cell>
                                <Table.Cell>Neuer Kommentar auf abonnierten Eintrag</Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell>
                                    <Checkbox/>
                                </Table.Cell>
                                <Table.Cell>
                                    <Checkbox/>
                                </Table.Cell>
                                <Table.Cell>Neue Antwort auf eigenen Kommentar</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Segment>
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    const userId = getUserId(state.user);

    return {
        activeEventId: getActiveEventId(state.events),
        activeEventName: getActiveEventName(state.events),
        userCanManageActiveEvent: getActiveEventUserPermissionLevel(state.events) >= PermissionLevelEnum.ADMINISTRATOR,
        userRoleId: getUserRoleId(state.eventInfo, userId),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        eventsActions: bindActionCreators(eventsActions, dispatch),
    };
}


const ConnectedUserSettings = connect(mapStateToProps, mapDispatchToProps)(UserSettings);
export { ConnectedUserSettings as UserSettings };