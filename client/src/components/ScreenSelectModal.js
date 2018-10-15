import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Modal, TransitionablePortal } from 'semantic-ui-react';
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
            selectedIdx: null,
        };
    }


    _handleThumbnailClick = (idx) => (e) => {
        this.setState({
            selectedIdx: idx,
        });
    };


    _handleSelectClick = (e) => {
        this.props.onSelect(this.state.selectedIdx, e);
    };


    render() {
        const { isOpen, onCancel, thumbnails } = this.props;
        const { selectedIdx } = this.state;

        return (
            <TransitionablePortal
                transition={{ animation: 'scale', duration: 300 }}
                open={isOpen}
            >
                <Modal
                    open
                >
                    <Modal.Header>Bildschirmübertragung starten</Modal.Header>
                    <Modal.Content>
                        <ThumbnailGroup
                            isCentered
                        >
                            {thumbnails.map((imageData, idx) => 
                                <Thumbnail
                                    key={idx}
                                    alt={idx}
                                    isHuge
                                    isSelectable
                                    isSelected={idx === selectedIdx}
                                    onClick={this._handleThumbnailClick(idx)}
                                    src={imageData}
                                />
                            )}
                        </ThumbnailGroup>
                        <Container
                            textAlign='center'
                        >
                            Bitte denken Sie daran, private Inhalte zu schließen und ggf. (System-)Benachrichtigungen auszuschalten.
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