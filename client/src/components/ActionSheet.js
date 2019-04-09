import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Modal, List, TransitionablePortal, Divider } from 'semantic-ui-react';


const ListIconPaddingFix = styled(List.Icon)`
    &&&&& {
        padding-right: 0;
    }
`;


export class ActionSheet extends React.PureComponent {
    static get propTypes() {
        return {
            actions: PropTypes.arrayOf(PropTypes.shape({
                color: PropTypes.string,
                name: PropTypes.string.isRequired,
                icon: PropTypes.string.isRequired,
                onClick: PropTypes.func.isRequired,
            })),
            isCentered: PropTypes.bool,
            isOpen: PropTypes.bool.isRequired,
            onClose: PropTypes.func.isRequired,
        };
    };

    static get defaultProps() {
        return {
            isCentered: true,
        };
    };


    render() {
        const { actions, isCentered, isOpen, onClose } = this.props;

        return (
            <TransitionablePortal
                transition={{ animation: 'fade up', duration: 300 }}
                open={isOpen}
                onClose={onClose} // TODO
            >
                <Modal
                    open={true}
                    size="mini"
                    centered={isCentered}
                    onClose={onClose}
                >
                    {/* <Modal.Header>Aktion wählen</Modal.Header> */}
                    <Modal.Content>
                        {actions.length > 0 ? (
                            <List 
                                selection
                                size='large'
                            >
                                {actions.map((action, idx) =>
                                    action.isSeparator ? (
                                        <Divider/>
                                    ) : (
                                        <List.Item
                                            key={idx}
                                            onClick={action.onClick}
                                        >
                                            <ListIconPaddingFix
                                                color={action.color}
                                                name={action.icon}
                                                verticalAlign='middle'
                                            />
                                            <List.Content
                                                color={action.color}
                                                header={action.name}
                                            />
                                        </List.Item>
                                    )
                                )}
                            </List>
                        ) : (
                            <p>
                                Keine Aktionen verfügbar.
                            </p>
                        )}
                        <Button
                            content="Schließen"
                            fluid
                            onClick={onClose}
                        />
                    </Modal.Content>
                </Modal>
            </TransitionablePortal>
        );
    }
}