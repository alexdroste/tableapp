import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import * as imagesActions from '../actions/images';
import { connect } from 'react-redux';
import { Image } from 'semantic-ui-react';
import { ImageModal } from './ImageModal';
import { getThumbnailDict } from '../reducers/images';
import { Thumbnail } from '../components/Thumbnail';


class Thumbnails extends React.Component {
    static get propTypes() {
        return {
            imageIds: PropTypes.array.isRequired,
        };
    };

    static get defaultProps() {
        return {
            imageIds: [],
        };
    };

    // static get contextTypes() {
    //     return {
    //         router: PropTypes.object.isRequired
    //     };
    // }


    constructor(props) {
        super(props);

        this.state = {
            openId: null
        };
    }


    componentDidMount() {
        this._requestMissingThumbnails();
    }


    componentDidUpdate() {
        this._requestMissingThumbnails();
    }


    _requestMissingThumbnails = () => {
        const missingIds = [];
        this.props.imageIds.forEach((id) => {
            if (!this.props.thumbnailDict[id])
                missingIds.push(id);
        });
        if (missingIds.length > 0)
            this.props.imagesActions.loadImages(missingIds, true);
    };


    _handleModalClose = (e) => {
        this.setState({
            openId: null,
        });
    };


    _handleModalSelect = (selected) => {
        let newSelection; 
        if (!selected) {
            newSelection = this.props.selectedIds.filter((id) => id !== this.state.openId);
        } else {
            if (this.props.selectedIds.indexOf(this.state.openId) !== -1)
                return;
            newSelection = this.props.selectedIds.slice();
            newSelection.push(this.state.openId);
        }
        this.setState({
            openId: null,
        });
        this.props.onSelectionChanged(newSelection);
    };


    _handleThumbnailClick = (id) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            openId: id,
        });
    };


    _renderThumbnail(id) {
        const {selectable, selectedIds, thumbnailDict} = this.props;
        const data = thumbnailDict[id];
        if (!data)
            return null;

        return (
            <Thumbnail
                key={id}
                alt={id}
                isSelectable={selectable}
                isSelected={selectedIds.indexOf(id) !== -1}
                onClick={this._handleThumbnailClick(id)}
                src={data}
            />
        );
    }


    render() {
        const {imageIds, placeholderThumbnailProps, selectable, selectedIds} = this.props;
        const {openId} = this.state;

        return (
            <div>
                <Image.Group>
                    {imageIds.map((id) => this._renderThumbnail(id))}
                    {placeholderThumbnailProps &&
                        <Thumbnail
                            key='placeholder'
                            {...placeholderThumbnailProps}
                        />
                    }
                </Image.Group>
                {openId &&
                    <ImageModal
                        imageId={openId}
                        onClose={this._handleModalClose}
                        onSelect={this._handleModalSelect}
                        selectable={selectable}
                        selected={selectable && selectedIds.indexOf(openId) !== -1}
                    />
                }
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        thumbnailDict: getThumbnailDict(state.images)
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        imagesActions: bindActionCreators(imagesActions, dispatch),
    };
}


const ConnectedThumbnails = connect(mapStateToProps, mapDispatchToProps)(Thumbnails);
export { ConnectedThumbnails as Thumbnails };