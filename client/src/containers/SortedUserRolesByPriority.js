import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRolePriority, getUserRoleId } from '../reducers/eventInfo';
import { RoleLabel } from './RoleLabel';
import * as utils from '../utils';


class SortedUserRolesByPriority extends React.Component {
    /**
     * @property {string[]} rolePriority array of role ids ordered by priority (injected by redux)
     * @property {string[]} userRoleIds ids roles to render
     */
    static get propTypes() {
        return {
            rolePriority: PropTypes.array.isRequired,
            userRoleIds: PropTypes.array.isRequired,
        };
    };

    static get defaultProps() {
        return {};
    };


    // TODO shouldComponentUpdate


    render() {
        const {rolePriority, userRoleIds} = this.props;

        // const roleIdsSorted = roleIds.slice();
        const roleIdsSorted = utils.uniqueArray(userRoleIds);
        roleIdsSorted.sort(function(a, b) {  
            return rolePriority.indexOf(a) - rolePriority.indexOf(b);
        });

        return roleIdsSorted.map(id => {
            return (
                <RoleLabel
                    key={id}
                    roleId={id}
                />
            );
        });
    }
}


const mapStateToProps = (state, props) => {
    // TODO reselect/memoization to prevent unnecessary updates
    const userRoleIds = props.userIds.reduce((acc, cur) => {
        const roleId = getUserRoleId(state.eventInfo, cur);
        if (roleId)
            acc.push(roleId);
        return acc;
    }, []);

    return {
        rolePriority: getRolePriority(state.eventInfo),
        userRoleIds,
    }
};


const ConnectedSortedUserRolesByPriority = connect(mapStateToProps)(SortedUserRolesByPriority);
export { ConnectedSortedUserRolesByPriority as SortedUserRolesByPriority };