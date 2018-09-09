import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as imagesActions from '../actions/images';
import { Button, Modal, Image, Loader, Dimmer } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Jimp from 'jimp';
import { config } from '../config';
import { Buffer } from 'buffer';
import { generateLocalImageId } from '../reducers/images';
import * as utils from '../utils';


const CenteredContent = styled.div`
    display: block;
    position: relative;

    & > * {
        margin: auto;
    }
`;


const DropzoneWrapper = styled.div`
    display: flex;
    margin: 1.5rem;
    justify-content: center;
    height: 200px;

    & > div {
        width: 100% !important;
        height: 100% !important;
        padding: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 16px;
    }
`;


class InputImageModal extends React.Component {
    /**
     * @property {function(e: object)} onClose callback if user clicked on close
     * @property {function(imageId: string)} onSelect callback if user provided and selected image, local imageId as param
     */
    static get propTypes() {
        return {
            onClose: PropTypes.func.isRequired,
            onSelect: PropTypes.func.isRequired,
        };
    };

    static get defaultProps() {
        return {
        };
    };


    constructor(props) {
        super(props);

        this.state = {
            imageData: null,
            loading: false,
        };

        this.unmounted = false;
    }


    componentWillUnmount() {
        this.unmounted = true;
    }


    _handleCloseClick = (e) => {
        this.props.onClose(e);
    };


    _handleDropAccepted = (files) => {
        const handleError = () => {
            console.log('could not process image');
            this.setState({ 
                imageData: null,
                loading: false,
            });
        };

        if (files.length < 1)
            return handleError();

        this.setState({ 
            loading: true,
        });

        const reader = new FileReader();
        reader.onabort = handleError;
        reader.onerror = handleError;
        reader.onload = () => {
            if (this.unmounted)
                return;
            const buffer = Buffer.from(reader.result);
            Jimp.read(buffer, (err, img) => {
                if (this.unmounted)
                    return;
                if (err) 
                    return handleError();
                // limit max height/width to max res (e.g. 1200px) but keep aspect ratio
                if (img.bitmap.width > config.inputImageMaxRes || img.bitmap.height > config.inputImageMaxRes) {
                    if (img.bitmap.width > img.bitmap.height)
                        img.resize(config.inputImageMaxRes, Jimp.AUTO);
                    else
                        img.resize(Jimp.AUTO, config.inputImageMaxRes);
                }
                img.getBase64(Jimp.MIME_PNG, (err, imageData) => {
                    if (this.unmounted)
                        return;
                    if (err) 
                        return handleError();
                    this.setState({ 
                        imageData,
                        loading: false,
                    });
                });
            });
        };
        reader.readAsArrayBuffer(files[0]);
    };


    _handleResetClick = (e) => {
        this.setState({
            imageData: null,
            loading: null,
        });
    };


    _handleSelectClick = (e) => {
        if (!this.state.imageData)
            return;
        const localId = generateLocalImageId();
        utils.createThumbnailFromBase64Image(this.state.imageData).then((thumbnailData) => {
            this.props.imagesActions.addLocalImage(localId, this.state.imageData, thumbnailData);
            this.props.onSelect(localId);
        }).catch(() => console.log('could not add image'));
    };
    

    render() {
        const {imageData, loading} = this.state;
        const acceptedMimeTypes = "image/bmp, image/jpeg, image/png";

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
                        {loading ? (
                            <div>
                                <br/>
                                <br/>
                                <br/>
                                <Dimmer active inverted>
                                    <Loader active inline='centered'/>
                                </Dimmer>
                            </div>
                        ) : (
                            imageData ? (
                                <Image
                                    src={imageData}
                                />
                            ) : (
                                <DropzoneWrapper>
                                    <Dropzone
                                        accept={acceptedMimeTypes}
                                        multiple={false}
                                        onDropAccepted={this._handleDropAccepted}
                                    >
                                        <p> Anklicken oder Datei per Drag &amp; Drop hereinziehen. </p>
                                        <p> Unterstützte Dateiformate: bmp, jpg, png </p>
                                    </Dropzone>
                                </DropzoneWrapper>
                            )
                        )}
                    </CenteredContent>
                </Modal.Content>
                    <Modal.Actions>
                        <Button
                            content="Schließen"
                            onClick={this._handleCloseClick}
                        />
                        {imageData &&
                            <Button
                                content="Zurücksetzen"
                                onClick={this._handleResetClick}
                            />
                        }
                        {imageData &&
                            <Button
                                content="Hinzufügen"
                                primary
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
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        imagesActions: bindActionCreators(imagesActions, dispatch),
    };
}


const ConnectedInputImageModal = connect(mapStateToProps, mapDispatchToProps)(InputImageModal);
export { ConnectedInputImageModal as InputImageModal };