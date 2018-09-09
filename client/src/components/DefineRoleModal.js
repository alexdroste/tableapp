import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLORS } from '../colors';
import { Input, Button, Label, Modal, Form, Icon } from 'semantic-ui-react';


const FittedIcon = styled(Icon)`
    margin: 0 !important;
`;


export class DefineRoleModal extends React.Component {
    /**
     * @property {string} [defaultColor="red"] color to be set by default
     * @property {string} [defaultName] name to be set by default
     * @property {function(e: object)} [onCancelClick] callback if users clicked on cancel
     * @property {function(e: object, data: object)} [onSaveClick] callback if users clicked on save
     */
    static get propTypes() {
        return {
            defaultColor: PropTypes.string,
            defaultName: PropTypes.string,
            onCancelClick: PropTypes.func.isRequired,
            onSaveClick: PropTypes.func.isRequired,
        };
    };

    static get defaultProps() {
        return {
            defaultColor: 'red',
            defaultName: '',
        };
    };


    constructor(props) {
        super(props);

        this.state = {
            color: props.defaultColor,
            name: props.defaultName,
        }
    }


    handleCancelClick = (e) => {
        this.props.onCancelClick(e);
    };


    handleColorClick = (e, data) => {
        this.setState({
            color: data.color,
        });
    };


    handleInputChange = (e, data) => {
        // max 20 characters
        if (data.value.length > 20)
            return;

        this.setState({
            name: data.value,
        });
    };


    handleSaveClick = (e) => {
        const data = {
            name: this.state.name,
            color: this.state.color,
        };
        this.props.onSaveClick(e, data);
    };


    render() {
        const {color, name} = this.state;

        return (
            <Modal 
                open
            >
                <Modal.Header>Rolle definieren</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Bezeichnung (max. 20 Zeichen)</label>
                            <Input
                                fluid
                                placeholder='Rollenbezeichnung...'
                                onChange={this.handleInputChange}
                                value={name}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Farbe</label>
                            {COLORS.map(c => 
                                <Label 
                                    as='a'
                                    circular 
                                    color={c} 
                                    key={c}
                                    onClick={this.handleColorClick}
                                >
                                    {color === c ? (
                                        <FittedIcon name="checkmark"/>
                                    ) : (
                                        "\u00a0"
                                    )}
                                </Label>
                            )}
                        </Form.Field>
                        <Form.Field>
                            <label>Vorschau</label>
                            <Label
                                content={name ? name : "Rolle"}
                                color={color}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button 
                        content="Abbrechen"
                        onClick={this.handleCancelClick}
                    />
                    <Button
                        positive
                        disabled={!name || !color}
                        content="Speichern"
                        onClick={this.handleSaveClick}
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
