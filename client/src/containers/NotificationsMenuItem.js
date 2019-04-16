import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Icon, Menu, Popup } from 'semantic-ui-react';
import { hasUnreadNotifications } from '../reducers/notifications';
import { NotificationList } from './NotificationList';


const CustomPopup = styled(Popup)`
    /* position: fixed !important; */

    &&& {
        padding: 0;
    }

    & > * {
        max-height: 400px;
        overflow: hidden;
        overflow-y: scroll;
        padding: .833em 1em;
    }
`;


const IconsMarginFix = styled(Icon.Group)`
    &&& .icon {
        margin-right: 0;
    }
`;


class NotificationsMenuItem extends React.Component {
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
            isOpen: false,
        };
    }


    _handlePopupOpen = () => {
        this.setState({ isOpen: true });
    };


    _handlePopupClose = () => {
        this.setState({ isOpen: false });
    };


    render() {
        const { hasUnreadNotifications } = this.props;
        const { isOpen } = this.state;

        return (
            <CustomPopup
                trigger={
                    <Menu.Item
                        active={isOpen}
                        position="right"
                    >
                        <IconsMarginFix>
                            <Icon name='bell'/>
                            {hasUnreadNotifications &&
                                <Icon corner='top right' name='circle' color='red'/>
                            }
                        </IconsMarginFix>
                    </Menu.Item>
                }
                hideOnScroll // FIXME TODO remove after 0.87.0 semantic update
                on='click'
                open={isOpen}
                onClick={this._handlePopupClose}
                onOpen={this._handlePopupOpen}
                onClose={this._handlePopupClose}
                wide
            >
                <div>
                    <NotificationList/>
                </div>
            </CustomPopup>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        hasUnreadNotifications: hasUnreadNotifications(state.notifications),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
    };
}


const ConnectedNotificationsMenuItem = connect(mapStateToProps, mapDispatchToProps)(NotificationsMenuItem);
export { ConnectedNotificationsMenuItem as NotificationsMenuItem };