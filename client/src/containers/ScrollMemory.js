import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';


class ScrollMemory extends React.Component {
    static get propTypes() {
        return {};
    };

    static get defaultProps() {
        return {};
    };


    constructor(props) {
        super(props);

        this.memory = {};
    }


    UNSAFE_componentWillReceiveProps(nextProps) {
        this.memory[this.props.location.pathname] = window.scrollY;
        // console.log('SAVE SCROLL location: ', this.props.location, ' => ', window.scrollY);                    
    }


    componentDidUpdate(prevProps) {
        const sy = this.memory[this.props.location.pathname];
        window.dispatchEvent(new CustomEvent('ScrollMemoryRestoreScroll', { detail: sy }));
        window.requestAnimationFrame(() => {
            window.scrollTo({ top: sy ? sy : 0, behavior: "instant" });
        });
        // console.log('RESTORE SCROLL location: ', this.props.location, ' => ', sy);                    
    }


    render() {
        return this.props.children;
    }
}


const wrappedScrollMemory = withRouter(ScrollMemory);
export { wrappedScrollMemory as ScrollMemory };
