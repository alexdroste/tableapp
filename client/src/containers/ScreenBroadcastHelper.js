import React from 'react';
import PropTypes from 'prop-types';
import Jimp from 'jimp';
import { Buffer } from 'buffer';
import { config } from '../config';
import { bindActionCreators } from 'redux';
import * as desktopAppActions from '../actions/desktopApp';
import { connect } from 'react-redux';
import { ScreenCapturer } from '../ScreenCapturer';
import { isBroadcastActive } from '../reducers/desktopApp';
import { ScreenSelectModal } from '../components/ScreenSelectModal';


class ScreenBroadcastHelper extends React.Component {
    static get propTypes() {
        return {
            desktopAppActions: PropTypes.object.isRequired,
            isBroadcastActive: PropTypes.bool.isRequired,
        };
    };

    static get defaultProps() {
        return {};
    };


    constructor(props) {
        super(props);

        this.state = {
            isBroadcasting: false,
            isOpen: false,
            selectedScreenIdx: null,
            thumbnails: [],
        };

        this._updateThumbnailsIntervalId = null;
        this._screenCaptureIntervalId = null;
        this._screenCapturer = new ScreenCapturer();
    }


    static getDerivedStateFromProps(props, state) {
        // make sure that selectedScreenIdx is always null when broadcast starts
        if (!props.isBroadcastActive && 
                (state.isBroadcasting || state.isOpen || state.selectedScreenIdx !== null)) {
            return { 
                isBroadcasting: false,
                isOpen: false, 
                selectedScreenIdx: null,
            };
        }
        if (props.isBroadcastActive && state.isOpen !== !(state.selectedScreenIdx !== null)) {
            return { isOpen: !(state.selectedScreenIdx !== null)};
        }
        return null;
    }


    componentDidMount() {
        this._screenCapturer.onScreenSetupChanged(this._handleScreenSetupChanged);
    }


    componentDidUpdate(prevProps, prevState) {
        // start/stop interval for update thumbnails
        if (!prevState.isOpen && this.state.isOpen) {
            this._updateThumbnails();
            this._updateThumbnailsIntervalId = setInterval(
                this._updateThumbnails, 3000);
        }
        else if (prevState.isOpen && !this.state.isOpen) {
            clearInterval(this._updateThumbnailsIntervalId);
            this._updateThumbnailsIntervalId = null;
        }
        // start/stop interval for doing screen capture
        if (!prevState.isBroadcasting && this.state.isBroadcasting) {
            this._captureAndBroadcast();
            this._screenCaptureIntervalId = setInterval(
                this._captureAndBroadcast, config.desktopApp.broadcastImageInterval);
        }
        else if (prevState.isBroadcasting && !this.state.isBroadcasting) {
            clearInterval(this._screenCaptureIntervalId);
            this._screenCaptureIntervalId = null;
        }
    }


    componentWillUnmount() {
        // properly unregister listener
        this._screenCapturer.onScreenSetupChanged(null);
        clearInterval(this._screenCaptureIntervalId);
        clearInterval(this._updateThumbnailsIntervalId);
    }


    _captureAndBroadcast = async () => {
        const { selectedScreenIdx } = this.state;
        const sources = await this._screenCapturer.capture(); 
        if (selectedScreenIdx >= sources.length) {
            this._unselectScreen();
            return;
        }

        const thumbnail = sources[selectedScreenIdx].thumbnail;

        // check for pic diffs (compare with last pic)
        const buf = Buffer.from(thumbnail.toPNG());
        const img = await Jimp.read(buf);
        if (this._lastBroadcastedImage) {
            // const distance = Jimp.distance(img, this._lastImg); // perceived distance
            const diff = Jimp.diff(img, this._lastBroadcastedImage);         // pixel difference

            // TODO tune tresholds
            if (/*distance < 0.15 ||*/ diff.percent < 0.025) {
                // if images match do nothing
                return;
            }
        }

        this._lastBroadcastedImage = img;
        this.props.desktopAppActions.broadcastNewImage(thumbnail.toDataURL());
    };


    _handleScreenSetupChanged = () => {
        this._unselectScreen();
    };


    _handleSelect = (selectedScreenIdx, e) => {
        this.setState({ 
            isBroadcasting: true,
            isOpen: false,
            selectedScreenIdx 
        });
    };


    _handleCancel = (e) => {
        this.props.desktopAppActions.broadcastCancelled();
    };


    _unselectScreen = () => {
        this.setState({ 
            isBroadcasting: false,
            isOpen: this.props.isBroadcastActive,
            selectedScreenIdx: null 
        });
        // todo check if /minicontrol => if, restore to full view (goBack)
    };


    _updateThumbnails = async () => {
        const sources = await this._screenCapturer.capture(); 
        this.setState({ 
            thumbnails: sources.map(source => source.thumbnail.toDataURL()),
        });
    }
    

    render() {
        const { isOpen, thumbnails } = this.state;

        return (
            <ScreenSelectModal
                isOpen={isOpen}
                onCancel={this._handleCancel}
                onSelect={this._handleSelect}
                thumbnails={thumbnails}
            />
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        isBroadcastActive: isBroadcastActive(state.desktopApp),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        desktopAppActions: bindActionCreators(desktopAppActions, dispatch),
    };
}


const ConnectedScreenBroadcastHelper = connect(mapStateToProps, mapDispatchToProps)(ScreenBroadcastHelper);
export { ConnectedScreenBroadcastHelper as ScreenBroadcastHelper };