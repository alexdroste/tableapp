import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { config } from '../config';
import { Button, Modal, Label, List } from 'semantic-ui-react';
import QRCode from 'qrcode.react';


const CenteredContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;


const ModalContent = styled.div`
    display: flex;
    & > div:not(:first-child) {
        margin-left: 1em;
    }
`;


const QRCodeWrapper = styled.div` 
    width: 100%;
    max-width: 75vh;
`;


const QRCodeWrapperInner = styled.div`
    width: 100%;
    padding-top: 100%;
    position: relative;

    & > svg {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
    }
`;


export class EventInfoModal extends React.Component {
    /**
     * @property {boolean} canManaged true if event is managable by current user
     * @property {string} eventId id of event
     * @property {boolean} hasJoined true if current user joined event
     * @property {boolean} isActive true if event is currently viewed/active
     * @property {boolean} isArchived true if event is archived
     * @property {string} name name/title of event
     * @property {function(e: object)} onClose callback if user clicked on close
     */
    static get propTypes() {
        return {
            canManage: PropTypes.bool.isRequired,
            eventId: PropTypes.string.isRequired,
            hasJoined: PropTypes.bool.isRequired,
            isActive: PropTypes.bool.isRequired,
            isArchived: PropTypes.bool.isRequired,
            name: PropTypes.string.isRequired,
            onClose: PropTypes.func.isRequired,
            onConfigureAction: PropTypes.func.isRequired,
            onJoinAction: PropTypes.func.isRequired,
            onLeaveAction: PropTypes.func.isRequired,
            onSwitchAction: PropTypes.func.isRequired,
        };
    };

    static get defaultProps() {
        return {
        };
    };


    constructor(props) {
        super(props);

        this.state = {
            qrCodeZoomed: false,
        }
    }


    _handleCloseClick = (e) => {
        this.props.onClose(e);
    };


    _handleConfigureClick = (e) => {
        this.props.onConfigureAction(e);
    };


    _handleJoinClick = (e) => {
        this.props.onJoinAction(e);
    };


    _handleLeaveClick = (e) => {
        this.props.onLeaveAction(e);
    };


    _handleQrCodeClick = (e) => {
        this.setState({
            qrCodeZoomed: true
        });
    };


    _handleQrCodeZoomCloseClick = (e) => {
        this.setState({
            qrCodeZoomed: false
        });
    };


    _handleSwitchClick = (e) => {
        this.props.onSwitchAction(e);
    };
    

    render() {
        const {canManage, eventId, hasJoined, isActive, isArchived, name} = this.props;
        const {qrCodeZoomed} = this.state;
        const joinUrl = config.baseUrl + 'join/' + eventId;

        return (
            <Modal 
                open
                closeIcon
                closeOnDocumentClick={false}
                size={qrCodeZoomed ? "fullscreen" : "tiny"}
                onClose={this._handleCloseClick}
            >
                <Modal.Header>
                    {name}
                </Modal.Header>
                <Modal.Content>
                    {qrCodeZoomed ? (
                        <CenteredContent>
                            <QRCodeWrapper>
                                <QRCodeWrapperInner>
                                    <QRCode
                                        renderAs="svg"
                                        value={joinUrl}
                                        onClick={this._handleQrCodeZoomCloseClick}
                                    />
                                </QRCodeWrapperInner>
                            </QRCodeWrapper>
                            <div>
                                <br/>
                                <Button 
                                    icon="zoom out"
                                    content="Verkleinern"
                                    onClick={this._handleQrCodeZoomCloseClick}
                                />
                            </div>
                        </CenteredContent>
                    ) : (
                        <ModalContent>
                            <div>
                                <QRCode
                                    renderAs="svg"
                                    size={128}
                                    value={joinUrl}
                                    onClick={this._handleQrCodeClick}
                                />
                            </div>
                            <div>
                                <List>
                                    {isActive &&
                                        <List.Item>
                                            <Label icon="eye" content="Gerade aktiv"/>
                                        </List.Item>
                                    }
                                    {hasJoined &&
                                        <List.Item>
                                            <Label icon="user" content="Beigetreten"/>
                                        </List.Item>
                                    }
                                    {canManage &&
                                        <List.Item>
                                            <Label icon="configure" content="Verwaltungsrecht"/>
                                        </List.Item>
                                    }
                                    {isArchived &&
                                        <List.Item>
                                            <Label icon="archive" content="Archiviert"/>
                                        </List.Item>
                                    }
                                </List>
                            </div>
                        </ModalContent>
                    )}
                </Modal.Content>
                {!qrCodeZoomed &&
                    <Modal.Actions>
                        {hasJoined &&
                            <Button
                                icon="close"
                                content="Verlassen"
                                negative
                                onClick={this._handleLeaveClick}
                                size="small"
                            />
                        }
                        {!hasJoined && !isArchived &&
                            <Button
                                icon="user"
                                content="Beitreten"
                                onClick={this._handleJoinClick}
                                positive
                                size="small"
                            />
                        }
                        {canManage &&
                            <Button
                                icon="configure"
                                color="violet"
                                content="Verwalten"
                                onClick={this._handleConfigureClick}
                                size="small"
                            />
                        }
                        {hasJoined && !isActive &&
                            <Button
                                icon="sign in"
                                content="Wechseln zu"
                                onClick={this._handleSwitchClick}
                                primary
                                size="small"
                            />
                        }
                    </Modal.Actions>
                }
            </Modal>
        );
    }
}
