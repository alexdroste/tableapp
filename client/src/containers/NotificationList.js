import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as notificationsActions from '../actions/notifications';
import { List } from 'semantic-ui-react';
import { getNotificationIdsSorted } from '../reducers/notifications';
import { NotificationItem } from './NotificationItem';


const ListContentNoMargin = styled(List.Content)`
    &&&&&&&&&& {
        margin: 0;
    }
`;


class NotificationList extends React.Component {
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


    // constructor(props) {
    //     super(props);

    //     this.state = {
    //     };
    // }
    

    _handleMarkAllAsRead = () => {
        this.props.notificationsActions.markAllUnreadNotificationsAsRead();
    };


    render() {
        const { notificationIdsSorted } = this.props;

        return (
            <List
                divided
                selection
            >
                {!!notificationIdsSorted.length && 
                    <List.Item
                        as='a'
                        onClick={this._handleMarkAllAsRead}
                    >
                        <ListContentNoMargin floated='right'>
                            Alle als gelesen markieren
                        </ListContentNoMargin>
                        <List.Icon name='envelope open'/>
                    </List.Item>
                }
                {notificationIdsSorted.map(id => 
                    <NotificationItem key={id} id={id}/>)}
                {!notificationIdsSorted.length &&
                    <List.Item disabled>
                        Keine neuen Benachrichtigungen.
                    </List.Item>
                }
            </List>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        notificationIdsSorted: getNotificationIdsSorted(state.notifications),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        notificationsActions: bindActionCreators(notificationsActions, dispatch),
    };
}


const ConnectedNotificationList = connect(mapStateToProps, mapDispatchToProps)(NotificationList);
export { ConnectedNotificationList as NotificationList };