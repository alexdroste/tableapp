import React from 'react';
import PropTypes from 'prop-types';
import { WebFrameScaler } from '../WebFrameScaler';
import { Button, Container, Modal, Statistic, TransitionablePortal } from 'semantic-ui-react';


export class ZoomModal extends React.PureComponent {
    static get propTypes() {
        return {
            isOpen: PropTypes.bool.isRequired,
            onClose: PropTypes.func.isRequired,
        };
    };

    static get defaultProps() {
        return { };
    };


    constructor(props) {
        super(props);

        this._zoomStep = 0.25;
        this._webFrameScaler = new WebFrameScaler();
    }


    _handleZoomIn = (e) => {
        this._webFrameScaler.setZoomLevel(this._webFrameScaler.getZoomLevel() + this._zoomStep);
        this.forceUpdate();
    };


    _handleZoomOut = (e) => {
        let zoomLevel = this._webFrameScaler.getZoomLevel();
        zoomLevel -= this._zoomStep;
        if (zoomLevel < 1.0)
            zoomLevel = 1.0;
        this._webFrameScaler.setZoomLevel(zoomLevel);
        this.forceUpdate();
    };


    render() {
        const { isOpen, onClose } = this.props;
        const zoomLevel = Math.round(this._webFrameScaler.getZoomLevel() * 100) / 100;

        return (
            <TransitionablePortal
                transition={{ animation: 'scale', duration: 300 }}
                open={isOpen}
            >
                <Modal
                    open={true}
                    size='mini'
                    onClose={onClose}
                >
                    <Modal.Header>
                        Schriftgröße / Zoom verändern
                    </Modal.Header>
                    <Modal.Content>
                        <Container textAlign='center'>
                            <Statistic
                                label='Zoom Faktor'
                                value={zoomLevel}
                            />
                            <br/>
                            <Button.Group>
                                <Button
                                    icon='minus'
                                    onClick={this._handleZoomOut}
                                />
                                <Button
                                    icon='plus'
                                    onClick={this._handleZoomIn}
                                />
                            </Button.Group>
                        </Container>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            content='Schliessen'
                            onClick={onClose}
                        />
                    </Modal.Actions>
                </Modal>
            </TransitionablePortal>
        );
    }
}