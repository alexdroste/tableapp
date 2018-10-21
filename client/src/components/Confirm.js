import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, TransitionablePortal } from 'semantic-ui-react';


export class Confirm extends React.PureComponent {
    static get propTypes() {
        return {
            cancelText: PropTypes.string,
            confirmText: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            hasCancel: PropTypes.bool,
            headerText: PropTypes.string,
            isNegative: PropTypes.bool,
            isOpen: PropTypes.bool.isRequired,
            onCancel: PropTypes.func.isRequired,
            onConfirm: PropTypes.func.isRequired,
        };
    };

    static get defaultProps() {
        return {
            cancelText: "Abbrechen",
            hasCancel: false,
            isNegative: false,
        };
    };


    render() {
        const { cancelText, confirmText, content, hasCancel, headerText, 
            isNegative, isOpen, onCancel, onConfirm } = this.props;

        return (
            <TransitionablePortal
                transition={{ animation: 'scale', duration: 300 }}
                open={isOpen}
            >
                <Modal
                    open={true}
                    size='mini'
                    onClose={onCancel}
                >
                    {headerText &&
                        <Modal.Header>
                            {headerText}
                        </Modal.Header>
                    }
                    <Modal.Content>
                        {content}
                    </Modal.Content>
                    <Modal.Actions>
                        {hasCancel &&
                            <Button
                                content={cancelText}
                                onClick={onCancel}
                            />
                        }
                        <Button
                            content={confirmText}
                            color={isNegative ? "red" : "green"}
                            onClick={onConfirm}
                        />
                    </Modal.Actions>
                </Modal>
            </TransitionablePortal>
        );
    }
}