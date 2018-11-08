import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUser } from '../reducers/eventInfo';


class NameSpan extends React.Component {
    /**
     * @property {String} [authorId] id of user
     * @property {String} [name] name to display
     */
    static get propTypes() {
        return {
            authorId: PropTypes.string,
            name: PropTypes.string,
        };
    };

    static get defaultProps() {
        return {};
    };


    render() {
        const { name } = this.props;

        return (
            <span>
                {name ? name : "Anonym"}
            </span>
        );
    }
}


const mapStateToProps = (state, props) => {
    let name = null;
    const user = getUser(state.eventInfo, props.authorId);
    if (props.authorId && user)
        name = user.name ? user.name : null;
    return {
        name,
    }
};


const ConnectedNameSpan = connect(mapStateToProps)(NameSpan);
export { ConnectedNameSpan as NameSpan };