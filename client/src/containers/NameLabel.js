import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRole, getUser } from '../reducers/eventInfo';
import { Label } from 'semantic-ui-react';


class NameLabel extends React.Component {
    /**
     * @property {String} [authorId] id of user
     * @property {String} [name] name to display
     * @property {String} [roleInfo] roleInfo object
     */
    static get propTypes() {
        return {
            authorId: PropTypes.string,
            name: PropTypes.string,
            roleInfo: PropTypes.object,
        };
    };

    static get defaultProps() {
        return {};
    };


    render() {
        const {name, roleInfo} = this.props;

        if (!roleInfo)
            return (
                <Label
                    content={name ? name : "Anonym"}
                    size="tiny"
                />
            );

        return (
            <Label 
                color={roleInfo.color}
                content={name}
                detail={roleInfo.name}
                size="tiny"
            />
        );
    }
}


const mapStateToProps = (state, props) => {
    let name = null;
    let roleInfo = null;
    const user = getUser(state.eventInfo, props.authorId);
    if (props.authorId && user) {
        name = user.name ? user.name : null;
        roleInfo = user.roleId ? getRole(state.eventInfo, user.roleId) : null;
    }
    return {
        name,
        roleInfo
    }
};


const ConnectedNameLabel = connect(mapStateToProps)(NameLabel);
export { ConnectedNameLabel as NameLabel };