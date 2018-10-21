import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getActiveEventId, getEvent } from '../reducers/events';
import * as eventsActions from '../actions/events';
import { PermissionLevelEnum } from '../PermissionLevelEnum';
import {Segment, Button, Icon} from 'semantic-ui-react';
import { EventInfoModal } from '../components/EventInfoModal';


const ControlsWrapper = styled.div`
    margin-top: .5em;
    display: flex;
    align-items: center;
`;


const Stretch = styled.span`
    flex: 1;
`;


const EventActiveIcon = styled(Icon).attrs({
    color: "grey"
})`
    line-height: 1;
`;


class EventItem extends React.Component {
    /**
     * @property {boolean} [defaultOpen=false] initival value 'more' modal open state
     * @property {string} eventId id of event
     * @property {boolean} isActive true if event is currently viewed/active
     * @property {boolean} isArchived true if event is archived
     * @property {string} name name/title of event
     * @property {number} permissionLevel own permission level {@link PermissionLevelEnum}
     */
    static get propTypes() {
        return {
            defaultOpen: PropTypes.bool,
            eventId: PropTypes.string.isRequired,
            isActive: PropTypes.bool.isRequired,
            isArchived: PropTypes.bool.isRequired,
            name: PropTypes.string.isRequired,
            permissionLevel: PropTypes.number.isRequired,
        };
    };

    static get defaultProps() {
        return {
            defaultOpen: false
        };
    };

    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }


    constructor(props) {
        super(props);

        this.state = {
            modalOpen: props.defaultOpen
        };
    }


    _handleConfigureClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!this.props.isActive)
            this.props.eventsActions.switchActiveEvent(this.props.eventId);
        this.context.router.history.push('/eventsettings');
    };


    _handleJoinClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.props.eventsActions.joinEvent(this.props.eventId);
        this._handleSwitchClick(e);
    };


    _handleLeaveClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.props.eventsActions.leaveEvent(this.props.eventId);
    };


    _handleSwitchClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!this.props.isActive)
            this.props.eventsActions.switchActiveEvent(this.props.eventId);
        this.context.router.history.push('/');
    };


    _handleModalClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            modalOpen: false
        });
    };


    _handleMoreClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            modalOpen: true
        });
    };
    
    
    render() {
        const {contentBefore, eventId, permissionLevel, isActive, isArchived, name} = this.props;
        const {modalOpen} = this.state;
        const hasJoined = permissionLevel >= PermissionLevelEnum.USER;
        const canManage = permissionLevel >= PermissionLevelEnum.ADMINISTRATOR;
        
        return (
            <Segment
                onClick={this._handleSwitchClick}
            >
                {contentBefore}
                {name}
                <ControlsWrapper>
                    {isActive &&
                        <EventActiveIcon
                            name="eye"
                        />
                    }
                    {hasJoined &&
                        <EventActiveIcon
                            name="user"
                        />
                    }     
                    {canManage &&
                        <EventActiveIcon
                            name="configure"
                        />
                    }
                    {isArchived &&
                        <EventActiveIcon
                            name="archive"
                        />
                    }
                    <Stretch/>
                    <Button.Group 
                        compact
                        size="tiny"
                    >
                        <Button
                            icon="ellipsis horizontal"
                            content="Details"
                            onClick={this._handleMoreClick}
                        />
                        {!hasJoined && !isArchived &&
                            <Button
                                icon="user"
                                content="Beitreten"
                                onClick={this._handleJoinClick}
                                positive
                            />
                        }
                        {hasJoined && !isActive &&
                            <Button
                                icon="sign in"
                                content="Wechseln zu"
                                onClick={this._handleSwitchClick}
                                primary
                            />
                        }
                        {canManage && isActive && 
                            <Button
                                icon="configure"
                                color="violet"
                                content="Verwalten"
                                onClick={this._handleConfigureClick}
                            />
                        }
                    </Button.Group>
                </ControlsWrapper>
                {modalOpen &&
                    <EventInfoModal
                        canManage={canManage}
                        eventId={eventId}
                        hasJoined={hasJoined}
                        isActive={isActive}
                        isArchived={isArchived}
                        name={name}
                        onClose={this._handleModalClose}
                        onConfigureAction={this._handleConfigureClick}
                        onJoinAction={this._handleJoinClick}
                        onLeaveAction={this._handleLeaveClick}
                        onSwitchAction={this._handleSwitchClick}
                    />
                }
            </Segment>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        ...getEvent(state.events, props.eventId),
        isActive: props.eventId === getActiveEventId(state.events),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        eventsActions: bindActionCreators(eventsActions, dispatch),
    };
}


const ConnectedEventItem = connect(mapStateToProps, mapDispatchToProps)(EventItem);
export { ConnectedEventItem as EventItem };
