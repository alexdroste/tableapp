import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as notificationsActions from '../actions/notifications';
import { Link, withRouter } from 'react-router-dom';
import { List, Label, Segment } from 'semantic-ui-react';
import { getNotificationById } from '../reducers/notifications';
import { getEventName } from '../reducers/events';
import { TimeStamp } from '../components/TimeStamp';
import { NotificationTypesEnum } from '../NotificationTypesEnum';


const EventTitleDiv = styled.div`
    color: rgba(0, 0, 0, 0.4);
    font-size: 12px;
`;


const CustomItem = styled(List.Item)`
    &&&&& {
        color: black;
    }
`;


const TopRightWrapper = styled.div`
    text-align: right;
`;


const TimeStampSub = styled(TimeStamp)`
    vertical-align: middle;
    line-height: 1;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
    margin-right: .5em;
`;


class NotificationItem extends React.Component {
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

    _getLink = () => {
        const { notification } = this.props;
        switch (notification.type) {
            case NotificationTypesEnum.COMMENT_ON_ENTRY:
            case NotificationTypesEnum.REPLY_ON_COMMENT: {
                const { commentId, entryId, eventId } = notification.data;
                return `/${eventId}/${entryId}#${commentId}`;
            }
            case NotificationTypesEnum.NEW_ENTRY: {
                const { entryId, eventId } = notification.data;
                return `/${eventId}/${entryId}`;
            }
            default:
                return '/';
        }
    };


    _getText = () => {
        const { notification } = this.props;
        switch (notification.type) {
            case NotificationTypesEnum.COMMENT_ON_ENTRY:
                return `${notification.sender || 'Jemand'} hat einen Eintrag kommentiert, dem du folgst.`;
            case NotificationTypesEnum.REPLY_ON_COMMENT:
                return `${notification.sender || 'Jemand'} hat auf deinen Kommentar geantwortet.`;
            case NotificationTypesEnum.NEW_ENTRY:
                return `${notification.sender || 'Jemand'} hat einen neuen Eintrag verfasst.`;
            default:
                return 'Unknown';
        }
    };


    _handleClick = () => {
        this.props.notificationsActions.readNotification(this.props.id);
    };


    render() {
        const { eventName, notification } = this.props;
        return (
            <CustomItem 
                as={Link}
                to={this._getLink()}
                onClick={this._handleClick}
            >
                <TopRightWrapper>
                    <TimeStampSub
                        timestamp={notification.timestamp}
                    />
                    {!notification.isRead &&
                        <Label
                            circular
                            color='blue'
                            size='mini'
                            empty
                        />
                    }
                </TopRightWrapper>
                <div>
                    {this._getText()}
                </div>
                <EventTitleDiv>
                    {eventName}
                </EventTitleDiv>
            </CustomItem>
        );
    }
}


const mapStateToProps = (state, props) => {
    const notification = getNotificationById(state.notifications, props.id);
    return {
        eventName: getEventName(state.events, notification.data.eventId) || notification.data.eventId, 
        notification,
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        notificationsActions: bindActionCreators(notificationsActions, dispatch),
    };
}


const ConnectedNotificationItem = withRouter(connect(mapStateToProps, mapDispatchToProps)(NotificationItem));
export { ConnectedNotificationItem as NotificationItem };