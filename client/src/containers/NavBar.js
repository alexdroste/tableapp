import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as desktopAppActions from '../actions/desktopApp';
import { withRouter, NavLink } from 'react-router-dom';
import { Button, Icon, Menu, Modal, Rail, Responsive, Sticky } from 'semantic-ui-react';
import { getActiveEventId, getActiveEventName, getActiveEventUserPermissionLevel } from '../reducers/events'; 
import { isDesktopApp, isWindowAlwaysOnTop, isBroadcastActive, isPresentationmodeActive } from '../reducers/desktopApp';
import { PermissionLevelEnum } from '../PermissionLevelEnum';
import { ActiveEventQrCodeModal } from './ActiveEventQrCodeModal';
import { MainNavActionSheet } from './MainNavActionSheet';
import { ZoomModal } from './ZoomModal';


const FixedTop = styled.div`
    position: fixed;
    top: ${props => props['data-withtitlebar'] ? '22px' : '0'}; // TitleBar height
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
            isActiveEventQrCodeModalOpen: false,
            isZoomModalOpen: false,
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


    _handleActivateMiniControlView = (e) => {
        this.props.desktopAppActions.setMiniControlViewActive(true);
    };


    _handleCloseQRCodeClick = (e) => {
        this.setState({
            isActiveEventQrCodeModalOpen: false,
        });
    };


    _handleGoBack = () => {
        this.context.router.history.goBack();
    };


    _handleMainItemClick = (e) => {
        this.setState({ navMainModalOpen: true });
    };


    _handleNavMainModalClose = (e) => {
        this.setState({ navMainModalOpen: false });
    };


    _handleShowQRCodeClick = (e) => {
        this.setState({
            isActiveEventQrCodeModalOpen: true,
        });
    };


    _handleStartPresentationModeClick = (e) => {
        this.props.desktopAppActions.setPresentationmodeActive(true);
        this.props.desktopAppActions.setWindowAlwaysOnTop(true);
    };


    _handleStopPresentationModeClick = (e) => {
        this.props.desktopAppActions.setPresentationmodeActive(false);
        this.props.desktopAppActions.setWindowAlwaysOnTop(false);
        if (this.props.isBroadcastActive)
            this.props.desktopAppActions.setBroadcastActive(false);
    };


    _handleToggleBroadcastClick = (e) => {
        this.props.desktopAppActions.setBroadcastActive(!this.props.isBroadcastActive);
    };


    _handleZoomModalClose = (e) => {
        this.setState({ isZoomModalOpen: false });
    };


    _handleZoomModalOpen = (e) => {
        this.setState({ isZoomModalOpen: true });
    };


    _updateHeight = () => {
        setTimeout(() => { // timeout needed to queue update after other elements rendered correctly
            if (!this.menuRef) 
                return;
            const newHeight = this.menuRef.clientHeight + this.menuRef.offsetTop;
            if (newHeight !== this.state.menuHeight)
                this.setState({
                    menuHeight: newHeight
                });
        }, 0);
    };


    _renderBar(isDesktop) {
        const { activeEventName, activeEventUserPermissionLevel, hasGoBack, 
            isBroadcastActive, isDesktopApp, isPresentationmodeActive, isWindowAlwaysOnTop,
            mainContent, rightRailContent } = this.props;
        const { isActiveEventQrCodeModalOpen, isZoomModalOpen, 
            menuHeight, navMainModalOpen } = this.state;
        const menuHeightPlusMargin = menuHeight + 14;
        const isMenuHeightMeasured = menuHeight > 0;
        const canBroadcast = activeEventUserPermissionLevel >= PermissionLevelEnum.ADMINISTRATOR;

        return (
            <div>
                <FixedTop 
                    innerRef={menuRef => menuRef && (this.menuRef = menuRef) }
                    data-withtitlebar={isDesktopApp}
                >
                    {isPresentationmodeActive ? ( 
                        <CustomMenu
                            pointing
                            secondary
                        >
                            <Menu.Item
                                content="Verkleinerte Ansicht (F8)"
                                icon="compress"
                                onClick={this._handleActivateMiniControlView}
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
                            <Menu.Item
                                content="Zoom"
                                icon="font"
                                onClick={this._handleZoomModalOpen}
                            />
                            <Menu.Item
                                content="QR"
                                icon="qrcode"
                                onClick={this._handleShowQRCodeClick}
                            />
                            <Menu.Item
                                content="Präsentationsmodus beenden"
                                icon="close"
                                position="right"
                                onClick={this._handleStopPresentationModeClick}
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
                                    onClick={this._handleStartPresentationModeClick}
                                />
                            }
                        </CustomMenu>
                    )}
                </FixedTop>
                <MenuHeight data-height={menuHeightPlusMargin}/>
                {/** check if menu height > 0 before render because offset for sticky will only be used on first render */}
                {isMenuHeightMeasured && hasGoBack && (isDesktop || (isDesktopApp && isPresentationmodeActive)) &&
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
                {/** check if menu height > 0 before render because offset for sticky will only be used on first render */}
                {isMenuHeightMeasured && isDesktop && rightRailContent &&
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
                {isActiveEventQrCodeModalOpen && 
                    <ActiveEventQrCodeModal
                        onClose={this._handleCloseQRCodeClick}
                    />
                }
                <MainNavActionSheet
                    isOpen={navMainModalOpen}
                    onClose={this._handleNavMainModalClose}
                />
                {isDesktopApp &&
                    <ZoomModal
                        isOpen={isZoomModalOpen}
                        onClose={this._handleZoomModalClose}
                    />
                }
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
        isPresentationmodeActive: isPresentationmodeActive(state.desktopApp),
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