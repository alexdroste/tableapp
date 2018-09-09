import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as desktopAppActions from '../actions/desktopApp';
import { Button, Label } from 'semantic-ui-react';
import { getEntryDict } from '../reducers/entries';


const Wrapper = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
`;


const CustomButton = styled(Button)`
    &&&&& {
        box-shadow: none;
        padding: 0;
        margin-top: 4px;
    }
`;



class MiniControlView extends React.Component {
    static get propTypes() {
        return {};
    };

    static get defaultProps() {
        return {};
    };

    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }


    constructor(props) {
        super(props);

        this.state = {
            startTrackingTimestamp: Date.now(),
            newEntriesCount: 0,
        };
    }


    static getDerivedStateFromProps(props, state) {
        const newEntriesCount = Object.keys(props.entryDict).reduce((acc, cur) => {
            if (props.entryDict[cur].timestamp >= state.startTrackingTimestamp)
                return acc + 1;
            return acc;
        }, 0);
        return { newEntriesCount };
    }


    componentDidMount() {
        this.props.desktopAppActions.resizeWindow(140, 130);
        this.props.desktopAppActions.setWindowAlwaysOnTop(true);
    }


    componentWillUnmount() {
        this.props.desktopAppActions.restoreLastWindowSize();
    }


    _handleWrapperClick = (e) => {
        this.context.router.history.goBack();
    };


    render() {
        const { newEntriesCount } = this.state;

        return (
            <Wrapper
                onClick={this._handleWrapperClick}
            >
                <Label
                    circular
                    color={newEntriesCount ? 'red' : undefined}
                    content={newEntriesCount}
                    size="massive"
                />
                <CustomButton
                    basic
                    content="Vergrößern"
                    icon="expand arrows alternate"
                />
            </Wrapper>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        entryDict: getEntryDict(state.entries),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        desktopAppActions: bindActionCreators(desktopAppActions, dispatch),
    };
}


const ConnectedMiniControlView = connect(mapStateToProps, mapDispatchToProps)(MiniControlView);
export { ConnectedMiniControlView as MiniControlView };