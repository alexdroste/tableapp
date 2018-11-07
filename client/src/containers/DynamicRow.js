import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import Measure from 'react-measure';


export class DynamicRow extends React.PureComponent {
    static get propTypes() {
        return {};
    };

    static get defaultProps() {
        return {};
    };


    constructor(props) {
        super(props);

        this.lastHeight = null;
        this._innerWrapperRef = null;
        this._lastIsVisible = false;
        this._nodeRef = React.createRef();
    }


    componentDidMount() {
        window.addEventListener('scroll', this._checkVisibility);
        window.addEventListener('resize', this._checkVisibility);
        this._checkVisibility();
    }


    componentDidUpdate(prevProps) {
        // this._checkVisibility();
        if (this.props.id !== prevProps.id) {
            this._lastIsVisible = false;
            this._onResize(this.lastHeight);
        }
    }


    componentWillUnmount() {
        window.removeEventListener('scroll', this._checkVisibility);
        window.removeEventListener('resize', this._checkVisibility);
    }


    _checkVisibility = debounce(() => {
        if (!this.props.onVisibilityChange)
            return;

        setTimeout(() => {
            // _checkVisibility might be called from componentDidMount, before component ref is assigned
            if (!this._nodeRef.current || !this._nodeRef.current.getBoundingClientRect) 
                return;
            
            const { top, height } = this._nodeRef.current.getBoundingClientRect();
            if (height === 0)
                return;
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const middle = top + height / 2;
            // determine visibility state by checking if middle-point is in viewport TODO improve
            const isVisible = middle >= 0 && middle <= windowHeight;

            if (this._lastIsVisible !== isVisible)
                this.props.onVisibilityChange(isVisible);

            this._lastIsVisible = isVisible;
        }, 0);
    }, 1000);


    _onResize = (height) => {
        if (height == null)
            return;
        this.lastHeight = height;
        const {cache, id} = this.props;
        cache.setHeightForId(id, height);
        this._checkVisibility();
    };


    _handleResize = (contentRect) => {
        this._onResize(contentRect.bounds.height);     
    };


    render() {
        const {children, style} = this.props;

        return (
            <div
                ref={this._nodeRef}
                style={style}
            >
                <Measure
                    bounds
                    onResize={this._handleResize}
                >   
                    {({measureRef}) => {
                        return (
                        <div 
                            ref={measureRef}
                            style={{overflow: "auto"}}
                        >
                            {children}
                        </div>
                    )}}
                </Measure>
            </div>
        );
    }
}
