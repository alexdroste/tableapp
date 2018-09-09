import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { config } from '../config';
import { Button, Modal } from 'semantic-ui-react';
import QRCode from 'qrcode.react';
import { getActiveEventId, getActiveEventName } from '../reducers/events';


const CenteredContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
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

/**
 * @callback ActiveEventQrCodeModal~onCloseCallback
 * @param {Event} e 
 */

/**
 * Displays a modal showing a qr code with direct join link to the active event.
 * 
 * __Exported component is connected to redux-store. Some props are injected by HOC.__
 * @param {object} props
 * @param {string} props.activeEventId id of event (injected by redux)
 * @param {string} props.activeEventName name/title of event (injected by redux)
 * @param {ActiveEventQrCodeModal~onCloseCallback} props.onClose callback if user clicked on close
 * @param {object} props.trigger trigger component
 */
class ActiveEventQrCodeModal extends React.Component {
    static get propTypes() {
        return {
            activeEventId: PropTypes.string.isRequired,
            activeEventName: PropTypes.string.isRequired,
            onClose: PropTypes.func.isRequired,
            trigger: PropTypes.object.isRequired,
        };
    };

    static get defaultProps() {
        return {
        };
    };


    /**
     * Handles close click.
     * @function
     * @private
     * @param {Event} e
     */
    _handleCloseClick = (e) => {
        this.props.onClose(e);
    };
    

    render() {
        const {activeEventId, activeEventName, trigger} = this.props;
        const joinUrl = config.baseUrl + 'join/' + activeEventId;

        return (
            <Modal 
                trigger={trigger}
                closeIcon
                closeOnDocumentClick={true}
            >
                <Modal.Header>
                    {activeEventName}
                </Modal.Header>
                <Modal.Content>
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
                    </CenteredContent>
                </Modal.Content>
                {/* <Modal.Actions>
                    <Button
                        content="Schließen"
                        onClick={this._handleCloseClick}
                    />
                </Modal.Actions> */}
            </Modal>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        activeEventId: getActiveEventId(state.events),
        activeEventName: getActiveEventName(state.events),
    }
};


const ConnectedActiveEventQrCodeModal = connect(mapStateToProps)(ActiveEventQrCodeModal);
export { ConnectedActiveEventQrCodeModal as ActiveEventQrCodeModal };
