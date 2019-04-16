import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { List } from 'semantic-ui-react';
import { getNotificationIdsSorted } from '../reducers/notifications';
import { NotificationItem } from './NotificationItem';


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


    render() {
        const { notificationIdsSorted } = this.props;

        return (
            <List
                divided
                selection
            >
                {notificationIdsSorted.map(id => 
                    <NotificationItem id={id}/>)}
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
        // TODO
    };
}


const ConnectedNotificationList = connect(mapStateToProps, mapDispatchToProps)(NotificationList);
export { ConnectedNotificationList as NotificationList };