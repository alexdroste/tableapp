import React from 'react';
import PropTypes from 'prop-types';
import Measure from 'react-measure';


export class DynamicRow extends React.Component {
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
    }


    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id)
            this._onResize(this.lastHeight);
    }


    _onResize = (height) => {
        if (height == null)
            return;
        this.lastHeight = height;
        const {cache, id} = this.props;
        cache.setHeightForId(id, height);
    };


    _handleResize = (contentRect) => {
        this._onResize(contentRect.bounds.height);     
    };


    render() {
        const {children, style} = this.props;

        return (
            <div
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
