import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as desktopAppActions from '../actions/desktopApp';
import { withRouter, NavLink } from 'react-router-dom';
import { Button, Icon, Menu, Responsive } from 'semantic-ui-react';
import { getActiveEventId, getActiveEventName, getActiveEventUserPermissionLevel } from '../reducers/events'; 
import { isDesktopApp, isWindowAlwaysOnTop, isBroadcastActive } from '../reducers/desktopApp';
import { PermissionLevelEnum } from '../PermissionLevelEnum';


const FixedTop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 101;
    background: white;

    ${props => props['data-desktop'] && `
        display: flex;

        & > div {
            flex: 1 1 auto;
        }
    `}
`;


const CustomMenu = styled(Menu)`
    justify-content: center;
    margin: 0 !important;

    &&&&& > .item {
        background: none;
    }

    &&& > * {
        flex: 0 1 auto;
    }
`;


const MenuItemTitle = styled(Menu.Item)`
    text-align: center;
    justify-content: center;
    flex: 0 1 auto;

    &&&&& {
        font-weight: 700;
    }
`;


const BroadcastScreenButton = styled(Button).attrs({
    basic: true,
})`
    &&&&&& {
        font-size: 0.64rem;
    }
`;


const MenuHeight = styled.div.attrs({
    style: props => ({
        marginBottom: (props['data-height'] + 13) + 'px' // +13px additional margin (=> height=1 => 14px margin)
    })
})`
    height: 1px;
`;


class NavBar extends React.Component {
    /**
     * @property {string} [activeEventName] title of active event (injected by redux)
     * @property {object} [offsetLeft=0] left offset in css px (for use with pushing sidebar for instance)
     */
    static get propTypes() {
        return {
            activeEventName: PropTypes.string,
            offsetLeft: PropTypes.number,
        };
    };

    static get defaultProps() {
        return {
            offsetLeft: 0
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
            menuHeight: 0
        };
    }


    componentDidMount() {
        this._updateHeight();
        window.addEventListener('resize', this._updateHeight);
    }


    componentWillUnmount() {
        window.removeEventListener('resize', this._updateHeight);
    }


    _handleGoBack = () => {
        this.context.router.history.goBack();
    };


    _handleToggleBroadcastClick = (e) => {
        this.props.desktopAppActions.setBroadcastActive(!this.props.isBroadcastActive);
    };


    _handleWindowAlwaysOnTopIconClick = (e) => {
        this.props.desktopAppActions.setWindowAlwaysOnTop(!this.props.isWindowAlwaysOnTop);
    };


    _updateHeight = () => {
        setTimeout(() => { // timeout needed to queue update after other elements rendered correctly
            if (!this.menuRef) 
                return;
            const newHeight = this.menuRef.clientHeight;
            if (newHeight !== this.state.menuHeight)
                this.setState({
                    menuHeight: this.menuRef.clientHeight
                });
        }, 0);
    };


    _renderBar(isDesktop) {
        const { activeEventName, activeEventUserPermissionLevel, hasGoBack, 
            hideNavigation, isBroadcastActive, isDesktopApp, isWindowAlwaysOnTop,
            mainContent } = this.props;
        const { menuHeight } = this.state;
        const canBroadcast = activeEventUserPermissionLevel >= PermissionLevelEnum.ADMINISTRATOR;
        const hasLeftItem = (!hideNavigation && isDesktopApp) || hasGoBack;
        const hasBroadcastButton = !hideNavigation && isDesktopApp && canBroadcast;

        return (
            <div>
                <FixedTop 
                    innerRef={menuRef => menuRef && (this.menuRef = menuRef) }
                    data-desktop={isDesktop}
                >
                    <CustomMenu
                        color="blue"
                        pointing={hideNavigation || isDesktop}
                        secondary
                    >
                        {hasGoBack && 
                            <Menu.Item
                                icon="chevron left"
                                onClick={this._handleGoBack}
                                position="left"
                            />
                        }
                        {/* {(!hideNavigation && isDesktopApp) &&
                            <Menu.Item
                                as={NavLink}
                                icon="compress"
                                position="left"
                                to="/minicontrol"
                            />
                        } */}
                        {(!hideNavigation && isDesktopApp) &&
                            <Menu.Item
                                position="left"
                            >
                                <Icon
                                    color={isWindowAlwaysOnTop ? "blue" : "grey"}
                                    name="pin"
                                    onClick={this._handleWindowAlwaysOnTopIconClick}
                                />
                                <NavLink
                                    to="/minicontrol"
                                >
                                    <Icon
                                        color="grey"
                                        name="compress"
                                    />
                                </NavLink>
                            </Menu.Item>
                        }
                        {mainContent ? (
                            <MenuItemTitle
                                header
                                content={mainContent}
                            />
                        ) : (
                            <MenuItemTitle
                                as={NavLink}
                                content={
                                    <div>
                                    <div>
                                    { activeEventName }
                                    </div>
                                    <div>Veranstaltung wechseln</div>
                                    </div>
                                }
                                icon="exchange"
                                to="/switchevent"
                            />
                        )}
                        {hasBroadcastButton &&
                            <Menu.Item
                                position={isDesktop ? undefined : "right"}
                            >
                                <BroadcastScreenButton
                                    color={isBroadcastActive ? "red" : "blue"}
                                    content={isBroadcastActive ? "Bildschirmübertragung stoppen" : "Bildschirmübertragung starten"}
                                    icon={isBroadcastActive ? "stop" : "record"}
                                    onClick={this._handleToggleBroadcastClick}
                                />
                            </Menu.Item>
                        }
                        {/* {((isDesktop && isDesktopApp) || hasGoBack || (isDesktopApp && !isDesktop && !canBroadcast)) && */}
                        {(hasLeftItem && (!hasBroadcastButton || isDesktop)) &&
                            <Menu.Item
                                icon=""
                                position="right"
                            />
                        }
                    </CustomMenu>
                    {!hideNavigation &&
                        <CustomMenu  
                            color="blue"
                            secondary
                            pointing
                            widths={isDesktop ? undefined : '4'}
                        >
                            <Menu.Item
                                as={NavLink}
                                icon="home"
                                to="/entries"
                                content="Startseite"
                            />
                            <Menu.Item
                                // as={NavLink}
                                icon="bell"
                                to="/notifications"
                                content="Mitteilungen"
                                disabled
                            />
                            <Menu.Item
                                // as={NavLink}
                                icon="search"
                                to="/search"
                                content="Durchsuchen"
                                disabled
                            />
                            <Menu.Item
                                as={NavLink}
                                icon="bars"
                                to="/settings"
                                content="Einstellungen"
                            />
                        </CustomMenu>
                    }
                </FixedTop>
                <MenuHeight data-height={menuHeight}/>
            </div>
        );
    }


    render() {
        return (
            <div>
                <Responsive
                    maxWidth={900}
                >
                    {this._renderBar(false)}
                </Responsive>
                <Responsive
                    minWidth={901}
                >
                    {this._renderBar(true)}
                </Responsive>
            </div>

        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        activeEventName: getActiveEventName(state.events),
        activeEventUserPermissionLevel: getActiveEventUserPermissionLevel(state.events),
        hideNavigation: !getActiveEventId(state.events) || props.hideNavigation,
        isBroadcastActive: isBroadcastActive(state.desktopApp),
        isDesktopApp: isDesktopApp(state.desktopApp),
        isWindowAlwaysOnTop: isWindowAlwaysOnTop(state.desktopApp),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        desktopAppActions: bindActionCreators(desktopAppActions, dispatch),
    };
}


const ConnectedNavBar = withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
export { ConnectedNavBar as NavBar };