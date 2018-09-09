import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';


class UserLoginView extends React.Component {
    static get propTypes() {
        return {};
    };

    static get defaultProps() {
        return {};
    };

    // static get contextTypes() {
    //     return {
    //         router: PropTypes.object.isRequired
    //     };
    // }


    // constructor(props) {
    //     super(props);

    //     this.state = {
    //     };
    // }


    render() {
        return (
            <div>
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        // TODO
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
    };
}


const ConnectedUserLoginView = connect(mapStateToProps, mapDispatchToProps)(UserLoginView);
export { ConnectedUserLoginView as UserLoginView };