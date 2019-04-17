import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Container, Modal, TransitionablePortal } from 'semantic-ui-react';
import { Thumbnail } from './Thumbnail';
import { ThumbnailGroup } from './ThumbnailGroup';


export class ScreenSelectModal extends React.PureComponent {
    static get propTypes() {
        return {
            isOpen: PropTypes.bool.isRequired,
            onCancel: PropTypes.func.isRequired,
            onSelect: PropTypes.func.isRequired,
            thumbnails: PropTypes.array.isRequired,
        };
    };

    static get defaultProps() {
        return {
            isCentered: true,
        };
    };


    constructor(props) {
        super(props);

        this.state = {
            canContinueOnScreenSetupChange: false,
            manual: false,
            selectedIdx: 'auto',
        };
    }


    _handleAutoClick = () => {
        this.setState({ 
            manual: false,
            selectedIdx: 'auto',
        });
    };


    _handleManualClick = () => {
        this.setState({ 
            manual: true,
            selectedIdx: null,
        });
    };


    _handleCanContinueOnScreenSetupChangeToggle = () => {
        this.setState({ 
            canContinueOnScreenSetupChange: !this.state.canContinueOnScreenSetupChange
        });
    };


    _handleThumbnailClick = (idx) => (e) => {
        this.setState({
            selectedIdx: idx,
        });
    };


    _handleSelectClick = (e) => {
        this.props.onSelect(this.state.selectedIdx, this.state.canContinueOnScreenSetupChange, e);
    };


    render() {
        const { isOpen, onCancel, thumbnails } = this.props;
        const { canContinueOnScreenSetupChange, manual, selectedIdx } = this.state;

        return (
            <TransitionablePortal // TODO fix close itself bug
                transition={{ animation: 'scale', duration: 300 }}
                open={isOpen}
            >
                <Modal
                    open
                >
                    <Modal.Header>Bildschirmübertragung starten</Modal.Header>
                    <Modal.Content>
                        <Container textAlign='center'>
                            <Button.Group>
                                <Button
                                    active={!manual}
                                    content="Automatisch"
                                    onClick={this._handleAutoClick}
                                />
                                <Button
                                    active={manual}
                                    content="Manuell"
                                    onClick={this._handleManualClick}
                                />
                            </Button.Group>
                        </Container>
                        <br/>
                        {/* TODO show text "loading" if thumbnails.length == 0*/}
                        {manual &&
                            <ThumbnailGroup
                                isCentered
                            >
                                {thumbnails.map((imageData, idx) => 
                                    <Thumbnail
                                        key={idx}
                                        alt={idx.toString()}
                                        isHuge
                                        isSelectable
                                        isSelected={idx === selectedIdx}
                                        onClick={this._handleThumbnailClick(idx)}
                                        src={imageData}
                                    />
                                )}
                            </ThumbnailGroup>
                        }
                        <Container
                            textAlign='center'
                        >
                            {manual &&
                                <Checkbox
                                    checked={canContinueOnScreenSetupChange}
                                    label="Übertragung automatisch fortsetzen, wenn sich der Bildschirmmodus ändert"
                                    onChange={this._handleCanContinueOnScreenSetupChangeToggle}
                                />
                            }
                            <br/>
                            <br/>
                            <i>Bitte denken Sie daran, private Inhalte zu schließen und ggf. (System-)Benachrichtigungen auszuschalten.</i>
                        </Container>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            content="Abbrechen"
                            negative
                            onClick={onCancel}
                        />
                        <Button
                            content="Übertragung starten"
                            disabled={selectedIdx === null || selectedIdx === undefined}
                            primary
                            onClick={this._handleSelectClick}
                        />
                    </Modal.Actions>
                </Modal>
            </TransitionablePortal>
        );
    }
}