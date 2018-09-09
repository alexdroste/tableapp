import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Header, Button, List, Form, Divider, Segment } from 'semantic-ui-react';
import { SearchPerson } from './SearchPerson';
import { RoleLabel } from './RoleLabel';
import { PermissionLevelEnum } from '../PermissionLevelEnum';
import { getUserDict, getRoleList } from '../reducers/eventInfo';


const ControlsWrapper = styled.div`
    display: flex;
    align-items: center;
`;


const Stretch = styled.span`
    flex: 1;
`;


const NameDiv = styled.div`
    font-size: 14px;
    word-wrap: break-word;
    margin-right: .3em;

    & > span {
        font-size: 12px;
        color: rgba(0,0,0,.6);
        display: block;
    }
`;


class ManageRolesForm extends React.Component {
    /**
     */
    static get propTypes() {
        return {
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


    renderListItems = () => {
        // TODO move following part outside of render to improve rerender performance
        const {userDict, roleList} = this.props;
        const roleDict = roleList.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});

        const admins = [];
        const mods = [];
        const others = [];

        Object.keys(userDict).forEach((userId) => {
            const permissionLevel = userDict[userId].permissionLevel;
            if (permissionLevel >= PermissionLevelEnum.ADMINISTRATOR) {
                admins.push(userId);
            } else if (permissionLevel >= PermissionLevelEnum.MODERATOR) {
                mods.push(userId);
            } else if (roleDict[userDict[userId].roleId]) {
                others.push(userId);
            }
        });

        const compareFunc = (a, b) => {
            const nameA = userDict[a].name;
            const nameB = userDict[b].name;
            if (nameA < nameB) 
                return -1;
            if (nameA > nameB) 
                return 1;
            return 0;
        };

        admins.sort(compareFunc);
        mods.sort(compareFunc);
        others.sort(compareFunc);

        const view = [
            { users: admins, text: "Administratoren" },
            { users: mods, text: "Moderatoren" },
            { users: others, text: "Andere" },
        ]

        return view.map((cur) => {
            return [
                <Divider horizontal content={cur.text}/>,     
                ...cur.users.map((userId) => {
                    const user = userDict[userId];
                    return (
                        <List.Item>
                            <List.Content>
                                <NameDiv>
                                    {user.name}
                                    <span>{user.email}</span>
                                </NameDiv>
                                <ControlsWrapper>
                                <RoleLabel
                                    roleId={user.roleId}
                                />
                                <Stretch/>
                                <Button
                                    icon="edit"
                                    size="mini"
                                />
                                </ControlsWrapper>
                            </List.Content>
                        </List.Item>
                    );
                }),
            ]
        });
    };


    render() {
        return (
            <Form
                as={Segment}
            >
                <Form.Field>
                    <Header 
                        content="Rechte/Rollen verwalten"
                    />
                </Form.Field>
                <Form.Field>
                    <SearchPerson/>
                </Form.Field>
                <Form.Field>
                    <List>
                        {this.renderListItems()}              
                    </List>
                </Form.Field>
            </Form>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        roleList: getRoleList(state.eventInfo),
        userDict: getUserDict(state.eventInfo),
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
    };
}


const ConnectedManageRolesForm = connect(mapStateToProps, mapDispatchToProps)(ManageRolesForm);
export { ConnectedManageRolesForm as ManageRolesForm };