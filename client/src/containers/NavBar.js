import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as desktopAppActions from '../actions/desktopApp';
import { withRouter, NavLink } from 'react-router-dom';
import { Button, Icon, Menu, Modal, Rail, Responsive, Sticky } from 'semantic-ui-react';
import { getActiveEventId, getActiveEventName, getActiveEventUserPermissionLevel } from '../reducers/events'; 
import { isDesktopApp, isWindowAlwaysOnTop, isBroadcastActive } from '../reducers/desktopApp';
import { PermissionLevelEnum } from '../PermissionLevelEnum';
import { ActiveEventQrCodeModal } from './ActiveEventQrCodeModal';
import { MainNavActionSheet } from './MainNavActionSheet';


const FixedTop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 101;
    background: white;
`;


const CustomMenu = styled(Menu)`
    justify-content: center;
    margin: 0 !important;

    &&&&& {
        border: none;
        background: #6b747d;
    }

    &&&&&&&&&& > .item {
        color: white;
        align-self: auto;
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
    basic: false,
})`
    &&&&&& {
        font-size: 0.64rem;
    }
`;


const MenuHeight = styled.div.attrs({
    style: props => ({
        marginBottom: (props['data-height'] - 1) + 'px'
    })
})`
    height: 1px;
`;


const CustomRail = styled(Rail).attrs({
    style: props => ({
        top: (props['data-menu-height']) + 'px' 
    })
})`
    &&&& {
        width: 80px;
        ${props => props.position === 'left' && 'text-align: right;'}
    }
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
            menuHeight: 0,
            navMainModalOpen: false,
        };

        this.contentWrapperRef = document.getElementById("contentWrapper");
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


    _handleMainItemClick = (e) => {
        this.setState({ navMainModalOpen: true });
    };


    _handleNavMainModalClose = (e) => {
        this.setState({ navMainModalOpen: false });
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
            isBroadcastActive, isDesktopApp, isWindowAlwaysOnTop,
            mainContent, rightRailContent } = this.props;
        const { menuHeight, navMainModalOpen } = this.state;
        const menuHeightPlusMargin = menuHeight + 14;
        const canBroadcast = activeEventUserPermissionLevel >= PermissionLevelEnum.ADMINISTRATOR;
        const presentationModeActive = isWindowAlwaysOnTop && isDesktopApp && canBroadcast;

        return (
            <div>
                <FixedTop 
                    innerRef={menuRef => menuRef && (this.menuRef = menuRef) }
                    data-desktop={isDesktop}
                >
                    {presentationModeActive ? ( 
                        <CustomMenu
                            pointing
                            secondary
                        >
                            <Menu.Item
                                as={NavLink}
                                content="Verkleinerte Ansicht"
                                icon="compress"
                                to="/minicontrol"
                            />
                            <Menu.Item>
                                <BroadcastScreenButton
                                    color={isBroadcastActive ? "red" : "blue"}
                                    content={isBroadcastActive ? "Bildschirmübertragung stoppen" : "Bildschirmübertragung starten"}
                                    icon={isBroadcastActive ? "stop" : "record"}
                                    onClick={this._handleToggleBroadcastClick}
                                />
                            </Menu.Item>
                            {/* <Menu.Item
                                content="Schriftgröße"
                                icon="font"
                                onClick={() => alert('todo')}
                            /> */}
                            <Modal 
                                trigger={
                                    <Menu.Item
                                        content="Zoom"
                                        icon="font"
                                    />
                                }
                                closeIcon
                            >
                                <Modal.Header>Schriftgröße verändern</Modal.Header>
                                <Modal.Content>
                                    <Modal.Description>
                                        <p>Um die Schriftgröße zu verändern, nutzen Sie folgende Tastenkombinationen:</p>
                                        <p>
                                            <b>Win:</b> strg + +/- (plus- oder minus-symbol)
                                            <br/>
                                            <b>Mac:</b> cmd + +/- (plus- oder minus-symbol)
                                        </p>
                                    </Modal.Description>
                                </Modal.Content>
                            </Modal>
                            <ActiveEventQrCodeModal
                                trigger={
                                    <Menu.Item
                                        content="QR"
                                        icon="qrcode"
                                    />
                                }
                            />
                            <Menu.Item
                                content="Präsentationsmodus beenden"
                                icon="close"
                                position="right"
                                onClick={this._handleWindowAlwaysOnTopIconClick}
                            />
                        </CustomMenu>
                    ) : (
                        <CustomMenu
                            color="blue"
                            pointing
                            secondary
                        >
                            {!isDesktop && hasGoBack && 
                                <MenuItemTitle
                                    content={mainContent}
                                    icon="arrow left"
                                    onClick={this._handleGoBack}
                                    position="left"
                                />
                            }
                            {(!mainContent || isDesktop) &&
                                <MenuItemTitle
                                    onClick={this._handleMainItemClick}
                                >
                                    {activeEventName}
                                    {'\u00A0' /* &nbsp; */}
                                    <Icon name="chevron down"/>
                                    {/* <Icon name="ellipsis horizontal"/> */}
                                </MenuItemTitle>
                            }
                            {(!hasGoBack || isDesktop) && isDesktopApp && canBroadcast && 
                                <Menu.Item
                                    content="Präsentation"
                                    icon="record"
                                    onClick={this._handleWindowAlwaysOnTopIconClick}
                                />
                            }
                        </CustomMenu>
                    )}
                </FixedTop>
                <MenuHeight data-height={menuHeightPlusMargin}/>
                {hasGoBack && (isDesktop || (isDesktopApp && presentationModeActive)) &&
                    <CustomRail 
                        close
                        position='left' 
                        data-menu-height={menuHeightPlusMargin}
                    >
                        <Sticky
                            context={this.contentWrapperRef}
                            offset={menuHeightPlusMargin}
                        >
                            {/* <Button
                                fluid
                                onClick={this._handleGoBack}
                            >
                                <Icon name="arrow left"/>
                                Zurück zu letzter Ansicht
                            </Button> */}
                            <Button
                                circular
                                icon="arrow left"
                                size="big"
                                onClick={this._handleGoBack}
                            />
                        </Sticky>
                    </CustomRail>
                }
                {isDesktop && rightRailContent &&
                    <CustomRail 
                        close
                        position='right' 
                        data-menu-height={menuHeightPlusMargin}
                    >
                        <Sticky
                            context={this.contentWrapperRef}
                            offset={menuHeightPlusMargin}
                        >
                            {rightRailContent}
                        </Sticky>
                    </CustomRail>
                }
                <MainNavActionSheet
                    isOpen={navMainModalOpen}
                    onClose={this._handleNavMainModalClose}
                />
            </div>
        );
    }


    render() {
        return (
            <div>
                <Responsive
                    maxWidth={800}
                >
                    {this._renderBar(false)}
                </Responsive>
                <Responsive
                    minWidth={801}
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