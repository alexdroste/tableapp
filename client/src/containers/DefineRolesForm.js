import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { COLORS } from '../colors';
import * as utils from '../utils';
import { Header, Button, Label, List, Segment } from 'semantic-ui-react';
import { DefineRoleModal } from '../components/DefineRoleModal';
import { getRoleList } from '../reducers/eventInfo';


const ListItemContentFlex = styled(List.Content)`
    display: flex;
    align-items: center;
`;


const Stretch = styled.span`
    flex: 1;
`;


class DefineRolesForm extends React.Component {
    /**
     * @property {object[]} roleList array of roles sorted by priority (injected by redux)
     */
    static get propTypes() {
        return {
            roleList: PropTypes.array.isRequired,
        };
    };

    static get defaultProps() {
        return {};
    };


    constructor(props) {
        super(props);

        this.state = {
            // editId defines, if edit-modal is shown (empty editId => no modal)
            editId: '',
        };
    }


    getUnusedColor = () => {
        const {roleList} = this.props;

        for (let color of COLORS) {
            let isInUse = false;
            for (let role of roleList) {
                if (role.color === color) {
                    isInUse = true;
                    break;
                }
            }
            if (!isInUse)
                return color;
        }

        // if every color is used, take red
        return 'red';
    };
    

    handleAddRoleClick = e => {
        this.setState({
            editId: utils.generateUUID() // set editId to newly generated (fresh) id
        });
    };


    handleItemEditClick = id => e => {
        this.setState({
            editId: id,
        });
    };


    handleItemDecreasePriorityClick = id => e => {
        alert("action: decrease priority " + id);
    };


    handleItemIncreasePriorityClick = id => e => {
        alert("action: increase priority " + id);
    };


    handleModalCancelClick = e => {
        this.setState({
            editId: '',
        });
    };


    handleModalSaveClick = (e, data) => {
        alert("action: save role > " + data.color + ' ' + data.name);
        this.setState({
            editId: '',
        });
    };


    renderListItems = () => {
        const {roleList} = this.props;

        return roleList.map((cur, i) => {
            const {id, name, color} = cur;

            return (
                <List.Item>
                    <ListItemContentFlex>
                        <Label
                            content={name}
                            color={color}
                        />
                        <Stretch/>
                        <Button.Group size="mini">
                            <Button 
                                disabled={i === 0}
                                icon="arrow up"
                                onClick={this.handleItemIncreasePriorityClick(id)}
                            />
                            <Button 
                                disabled={i === roleList.length - 1}
                                icon="arrow down"
                                onClick={this.handleItemDecreasePriorityClick(id)}                                
                            />
                            <Button 
                                icon="edit"
                                onClick={this.handleItemEditClick(id)}
                            />
                        </Button.Group>
                    </ListItemContentFlex>
                </List.Item>      
            );
        });
    };


    renderModal = () => {
        const {editId} = this.state;
        
        // if no edit id is set dont show modal
        if (!editId)
            return '';

        const {roleList} = this.props;
        let name, color;
        const foundRole = roleList.find((cur) => cur.id === editId);
        // check if role with editId exists
        if (foundRole) {
            // if so: load values
            name = foundRole.name;
            color = foundRole.color;
        } else {
            // if not: editId refers to a new role
            name = '';
            color = this.getUnusedColor();
        }

        return (
            <DefineRoleModal
                defaultColor={color}
                defaultName={name}
                onCancelClick={this.handleModalCancelClick}
                onSaveClick={this.handleModalSaveClick}
            />
        );
    };


    render() {
        return (
            <Segment>
                <Header 
                    content="Rollen definieren"
                />
                <List ordered>
                    {this.renderListItems()}              
                </List>
                <Button
                    content="Rolle hinzufügen"
                    icon="add"
                    onClick={this.handleAddRoleClick}
                />
                {this.renderModal()}
            </Segment>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        roleList: getRoleList(state.eventInfo),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
    };
}


const ConnectedDefineRolesForm = connect(mapStateToProps, mapDispatchToProps)(DefineRolesForm);
export { ConnectedDefineRolesForm as DefineRolesForm };