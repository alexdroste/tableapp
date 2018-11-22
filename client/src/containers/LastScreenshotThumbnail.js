import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getLastBroadcastedImage, isBroadcastActive } from '../reducers/desktopApp';
import { Icon } from 'semantic-ui-react';
import { Thumbnail } from '../components/Thumbnail';


const Wrapper = styled.div`
    position: relative;
    z-index: 70;
    ${props => props['data-asoverlay'] && `
        position: fixed; // will overwrite position: relative;
        bottom: 10px;
        right: 10px;
    `}
`;

const RecSymbolWrapper = styled.div`
    position: absolute;
    left: 5px;
    top: 5px;
`;



class LastScreenshotThumbnail extends React.Component {
    static get propTypes() {
        return {};
    };

    static get defaultProps() {
        return {};
    };

    // constructor(props) {
    //     super(props);

    //     this.state = {
    //     };
    // }


    render() {
        const { asOverlay, isBroadcastActive, lastBroadcastedImage } = this.props;

        if (!isBroadcastActive || !lastBroadcastedImage)
            return null;

        return (
            <Wrapper
                data-asoverlay={asOverlay}
            >
                <Thumbnail
                    src={lastBroadcastedImage}
                />
                <RecSymbolWrapper>
                    <Icon
                        color='red'
                        name='record'
                    />
                </RecSymbolWrapper>
            </Wrapper>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        isBroadcastActive: isBroadcastActive(state.desktopApp),
        lastBroadcastedImage: getLastBroadcastedImage(state.desktopApp),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
    };
}


const ConnectedLastScreenshotThumbnail = connect(mapStateToProps, mapDispatchToProps)(LastScreenshotThumbnail);
export { ConnectedLastScreenshotThumbnail as LastScreenshotThumbnail };