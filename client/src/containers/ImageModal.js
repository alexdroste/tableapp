import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as imagesActions from '../actions/images';
import { Button, Modal, Image, Loader, Dimmer } from 'semantic-ui-react';
import { getImage } from '../reducers/images';


const CenteredContent = styled.div`
    display: block;
    position: relative;

    & > * {
        margin: auto;
    }
`;


class ImageModal extends React.Component {
    /**
     * @property {function(e: object)} onClose callback if user clicked on close
     */
    static get propTypes() {
        return {
            onClose: PropTypes.func.isRequired,
        };
    };

    static get defaultProps() {
        return {
        };
    };


    constructor(props) {
        super(props);

        this.state = {
        }
    }


    componentDidMount() {
        this._requestImageIfMissing();
    }


    componentDidUpdate() {
        this._requestImageIfMissing();
    }


    _requestImageIfMissing = () => {
        if (!this.props.imageData)
            this.props.imagesActions.loadImages([this.props.imageId], false);
    };


    _handleCloseClick = (e) => {
        this.props.onClose(e);
    };


    _handleSelectClick = (e) => {
        this.props.onSelect(!this.props.selected);
    };
    

    render() {
        const {imageData, selectable, selected} = this.props;

        return (
            <Modal 
                open
                closeIcon
                closeOnDocumentClick={false}
                size="fullscreen"
                onClose={this._handleCloseClick}
            >
                <Modal.Content>
                    <CenteredContent>
                        {imageData ? (
                            <Image
                                src={imageData}
                            />
                        ) : (
                            <div>
                                <br/>
                                <br/>
                                <br/>
                                <Dimmer active inverted>
                                    <Loader active inline='centered'/>
                                </Dimmer>
                            </div>
                        )}
                    </CenteredContent>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        content="Schließen"
                        onClick={this._handleCloseClick}
                    />
                    {selectable && imageData &&
                        <Button
                            content={selected ? "Entfernen" : "Hinzufügen"}
                            primary={!selected}
                            negative={selected}
                            onClick={this._handleSelectClick}
                        />
                    }
                </Modal.Actions>
            </Modal>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        imageData: getImage(state.images, props.imageId),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        imagesActions: bindActionCreators(imagesActions, dispatch),
    };
}


const ConnectedImageModal = connect(mapStateToProps, mapDispatchToProps)(ImageModal);
export { ConnectedImageModal as ImageModal };