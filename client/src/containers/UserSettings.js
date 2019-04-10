import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Header, Segment, Table, Checkbox } from 'semantic-ui-react';
import * as userActions from '../actions/user';
import { getActiveNotificationTypes } from '../reducers/user';
import { NotificationTypesEnum } from '../NotificationTypesEnum';


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


    constructor(props) {
        super(props);

        this.rows = [
            { 
                desc: 'Neuer Eintrag',
                type: NotificationTypesEnum.NEW_ENTRY,
            },
            {
                desc: 'Neuer Kommentar auf abonnierten Eintrag',
                type: NotificationTypesEnum.COMMENT_ON_ENTRY,
            },
            {
                desc: 'Neue Antwort auf eigenen Kommentar',
                type: NotificationTypesEnum.REPLY_ON_COMMENT,
            },
        ];
    }


    componentWillMount() {
        this.props.userActions.getActiveNotificationTypes();
    }


    _handleCheckedChange = (which, type) => (e, data) => {
        const { activeNotificationTypes } = this.props;

        let n = which === 'email' ? activeNotificationTypes.emailNotifications : activeNotificationTypes.inAppNotifications;
        if(!data.checked) {
            n = n.filter(t => t !== type);
        } else {
            if (!n.includes(type)) {
                n.push(type);
                n.sort((a,b) => a-b);
            }
        }

        const emailNotifications = which === 'email' ? n : activeNotificationTypes.emailNotifications;
        const inAppNotifications = which === 'email' ? activeNotificationTypes.inAppNotifications : n;
        this.props.userActions.changeActiveNotificationTypes(emailNotifications, inAppNotifications);
    };


    render() {
        const { activeNotificationTypes } = this.props;

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
                            {this.rows.map((r, i) => 
                                <Table.Row key={i}>
                                    <Table.Cell>
                                        <Checkbox
                                            checked={activeNotificationTypes.inAppNotifications.includes(r.type)}
                                            onChange={this._handleCheckedChange('inApp', r.type)}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Checkbox
                                            checked={activeNotificationTypes.emailNotifications.includes(r.type)}
                                            onChange={this._handleCheckedChange('email', r.type)}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{r.desc}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </Segment>
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        activeNotificationTypes: getActiveNotificationTypes(state.user),
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    };
}


const ConnectedUserSettings = connect(mapStateToProps, mapDispatchToProps)(UserSettings);
export { ConnectedUserSettings as UserSettings };