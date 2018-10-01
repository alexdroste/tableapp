import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, List, Transition } from 'semantic-ui-react';


export class ActionSheet extends React.Component {
    static get propTypes() {
        return {
            actions: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string.isRequired,
                icon: PropTypes.string,
                onClick: PropTypes.func,
            })),
            isCentered: PropTypes.bool,
            onClose: PropTypes.func.isRequired,
        };
    };

    static get defaultProps() {
        return {
            isCentered: true,
        };
    };


    render() {
        const { actions, isCentered, onClose } = this.props;

        return (
            <Transition
                animation='fade up'
                transitionOnMount={true}
            >
                <Modal
                    open
                    size="mini"
                    onClose={onClose}
                    centered={isCentered}
                >
                    {/* <Modal.Header>Aktion wählen</Modal.Header> */}
                    <Modal.Content>
                        <List 
                            selection
                            size='large'
                        >
                            {actions.map(action =>
                                <List.Item
                                    header={action.name}
                                    icon={action.icon}
                                    onClick={action.onClick}
                                    disabled={!action.onClick}
                                />
                            )}
                        </List>
                        <Button
                            content="Abbrechen"
                            fluid
                            onClick={onClose}
                        />
                    </Modal.Content>
                </Modal>
            </Transition>
        );
    }
}