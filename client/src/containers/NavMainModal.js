import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'semantic-ui-react';
import { ActiveEventQrCodeModal } from '../containers/ActiveEventQrCodeModal';


const ActionsWrapper = styled(Modal.Description)`
    &&&&& > * {
        margin-bottom: 5px;
    }

    &&&&& > *:last-child {
        margin-bottom: 0;
    }

`;


class NavMainModal extends React.Component {
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


    _handleCloseClick = (e) => {
        this.props.onClose(e);
    };


    render() {
        return (
            <Modal
                closeIcon
                open
                size="mini"
                onClose={this._handleCloseClick}
                centered={false}
            >
                <Modal.Header>Aktion wählen</Modal.Header>
                <Modal.Content>
                    <ActionsWrapper>
                        <Button
                            as={Link}
                            content="Veranstaltung wechseln"
                            fluid
                            icon="exchange"
                            to="/switchevent"
                            onClick={this._handleCloseClick}
                        />
                        <ActiveEventQrCodeModal
                            trigger={
                                <Button
                                    content="QR-Code anzeigen"
                                    fluid
                                    icon="qrcode"
                                />
                            }
                        />
                        <Button
                            as={Link}
                            content="Einstellungen"
                            fluid
                            icon="setting"
                            to="/settings"
                            onClick={this._handleCloseClick}
                        />
                        <Button
                            content="Ausloggen"
                            fluid
                            icon="sign out"
                            disabled
                        />
                    </ActionsWrapper>
                </Modal.Content>
            </Modal>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        // TODO
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
    };
}


const ConnectedNavMainModal = connect(mapStateToProps, mapDispatchToProps)(NavMainModal);
export { ConnectedNavMainModal as NavMainModal };