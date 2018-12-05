import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as desktopAppActions from '../actions/desktopApp';
import { Button, Icon, Label } from 'semantic-ui-react';
import { getEntryDict } from '../reducers/entries';
import { isBroadcastActive } from '../reducers/desktopApp';
import { LastScreenshotThumbnail } from './LastScreenshotThumbnail';


const Wrapper = styled.div`
    position: fixed;
    top: 22px; // TODO remove workaround for TitleBar
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
        this.props.desktopAppActions.setWindowAlwaysOnTop(true);
    }


    _handleWrapperClick = (e) => {
        this.props.desktopAppActions.setMiniControlViewActive(false);
    };


    render() {
        const { isBroadcastActive } = this.props;
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
                <br/>
                {isBroadcastActive &&
                    <Label>
                        <Icon name='record' color='red' /> Übertragung
                    </Label>
                }
                {/* <LastScreenshotThumbnail/> */}
            </Wrapper>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        entryDict: getEntryDict(state.entries),
        isBroadcastActive: isBroadcastActive(state.desktopApp),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        desktopAppActions: bindActionCreators(desktopAppActions, dispatch),
    };
}


const ConnectedMiniControlView = connect(mapStateToProps, mapDispatchToProps)(MiniControlView);
export { ConnectedMiniControlView as MiniControlView };