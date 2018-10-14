import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commentsActions from '../actions/comments';
import * as entriesActions from '../actions/entries';
import * as imagesActions from '../actions/images';
import { getUserId } from '../reducers/user';
import { getComment } from '../reducers/comments';
import { getEntry } from '../reducers/entries';
import { Icon, Header, Button, Form, Divider, Card, Checkbox, TextArea, Dimmer, Message } from 'semantic-ui-react';
import { Content } from '../components/Content';
import { NameLabel } from './NameLabel';
import { FormFieldAction } from '../components/FormFieldAction';
import { Thumbnails } from './Thumbnails';
import { getScreenshotIds } from '../reducers/eventScreenshots';
import { InputImageModal } from './InputImageModal';


/**
 * Displays a form for creating new entries and comments.
 * If form is used for creating a comment, entry/comment that is
 * replied to is shown above inputs.
 * 
 * __Exported component is connected to redux-store. Some props are injected by HOC.__
 * @param {object} props
 * @param {function()} [props.onSubmit] callback if user submitted post
 * @param {object} props.commentsActions object containing bound commentsActions (injected by redux)
 * @param {object} props.entriesActions object containing bound entriesActions (injected by redux)
 * @param {object} props.imagesActions object containing bound imagesActions (injected by redux)
 * @param {boolean} [props.isComment] indicates if user is creating a comment (injected by redux)
 * @param {string} [props.replyAuthorId] id of author of comment to reply to (injected by redux if replyCommentId + replyEntryId are set)
 * @param {string} [props.replyCommentId] comment id to reply to ('0' => root entry)
 * @param {string} [props.replyContent] content of comment to reply to (injected by redux if replyCommentId + replyEntryId are set)
 * @param {string} [props.replyEntryId] entry id to reply to
 * @param {bool} [props.replyIsDeleted] indicates if entry or comment to reply to is deleted
 * @param {number} [props.replyTimeStamp] timestamp of comment to reply to (injected by redux if replyCommentId + replyEntryId are set)
 * @param {string[]} [props.screenshotIds] ids of event-screenshots (injected by redux if isComment == false)
 * @param {string} props.userId id of user creating entry/comment
 */
class UserPostForm extends React.Component {
    static get propTypes() {
        return {
            onSubmit: PropTypes.func,
            commentsActions: PropTypes.object.isRequired,
            entriesActions: PropTypes.object.isRequired,
            imagesActions: PropTypes.object.isRequired,
            isComment: PropTypes.bool,
            replyAuthorId: PropTypes.string,
            replyCommentId: PropTypes.string,
            replyContent: PropTypes.string,
            replyEntryId: PropTypes.string,
            replyIsDeleted: PropTypes.bool,
            replyTimeStamp: PropTypes.number,
            screenshotIds: PropTypes.array,
            userId: PropTypes.string.isRequired,
        };
    };

    static get defaultProps() {
        return {};
    };


    constructor(props) {
        super(props);

        /**
         * Holds text of textarea
         * @type {?string}
         */
        this.textAreaValue = null;

        /**
         * @type {object}
         * @property {string[]} imageIds holds all imageIds to display as thumbnails
         * @property {boolean} inputImageModalOpen indicates if modal for image input is open 
         * @property {boolean} postAnonymously indicates if entry should be posted anonymously
         * @property {string[]} selectedImageIds holds all imageIds the user selected to submit
         * @property {boolean} sendDisabled indicates if submit button ist disabled
         * @property {boolean} submitted indicates if entry was submitted recently
         */
        this.state = {
            imageIds: [],
            inputImageModalOpen: false,
            postAnonymously: true,
            selectedImageIds: [],
            sendDisabled: true,
            submitted: false,
        };

        /**
         * Dom-ref to textarea
         * @type {?object}
         */
        this.textAreaRef = React.createRef();
    }


    /**
     * Lifecycle that updates imageIds
     * @function
     */
    componentDidMount() {
        this._updateImageIds();
    }


    /**
     * Lifecycle that updates imageIds
     * @function
     */
    componentDidUpdate() {
        this._updateImageIds();
    }


    /**
     * Lifecycle that delete imported local images
     * @function
     */
    componentWillUnmount() {
        this._deleteImportedLocalImages();
    }


    /**
     * Sets input focus to text area
     * @function
     */
    focusTextArea = () => {
        if (!this.textAreaRef.current)
            return;
        this.textAreaRef.current.focus();
        if (this.state.submitted)
            this.setState({ submitted: false });
    };


    /**
     * Removes local imageIds from components state and removes the blobs from global state.
     * @function
     * @private
     */
    _deleteImportedLocalImages = () => {
        const imageIds = [];
        const localImageIds = [];
        this.state.imageIds.forEach((id) => {
            if (id.startsWith('local'))
                localImageIds.push(id);
            else
                imageIds.push(id);
        });
        const selectedImageIds = this.state.selectedImageIds.filter((id) => !id.startsWith('local'));
        if (localImageIds.length)
            this.props.imagesActions.removeImages(localImageIds);
        this.setState({ 
            imageIds,
            selectedImageIds,
        });
    };


    /**
     * Updates imageIds in components state.
     * Calculates imageIds by combining selectedImageIds 
     * (containing also imported ones) and screenshotIds.
     * Only triggers update if neccessary. 
     * @function
     * @private
     */
    _updateImageIds = () => {
        const imageIds = this.state.selectedImageIds.slice();
        if (this.props.screenshotIds) {
            this.props.screenshotIds.forEach((id) => {
                if (imageIds.indexOf(id) === -1)
                    imageIds.push(id);
            });
        }

        let doUpdate = false;
        if (imageIds.length !== this.state.imageIds.length)
            doUpdate = true;
        else {
            for (let i = 0; i < imageIds.length; ++i) {
                if (imageIds[i] !== this.state.imageIds[i]) {
                    doUpdate = true;
                    break;
                }
            }
        }

        if (doUpdate)
            this.setState({ imageIds });
    };


    /**
     * Handles click on dimmer. Resets submitted state.
     * @function
     * @private
     * @param {Event} [e]
     */
    _handleDimmerClick = (e) => {
        this.setState({
            submitted: false
        });
    };


    /**
     * Handles click on add image thumb. Opens modal to input image.
     * @function
     * @private
     * @param {Event} [e]
     */
    _handleImageAddClick = (e) => {
        this.setState({
            inputImageModalOpen: true
        });
    };


    /**
     * Handles modal close event. 
     * @function
     * @private
     */
    _handleInputImageModalClose = () => {
        this.setState({
            inputImageModalOpen: false,
        });
    };


    /**
     * Handles image added via input modal.
     * Adds received id to imageIds and selectedImageIds.
     * @function
     * @private
     * @param {string} localId (local) imageId to add to selection
     */
    _handleInputImageModalSelect = (localId) => {
        const imageIds = this.state.imageIds.slice();
        const selectedImageIds = this.state.selectedImageIds.slice();
        imageIds.push(localId);
        selectedImageIds.push(localId);
        this.setState({ 
            imageIds,
            inputImageModalOpen: false,
            selectedImageIds,
        });
    };


    /**
     * Handles postAnonymously checked change.
     * Toggles postAnonymously state.
     * @function
     * @private
     */
    _handlePostAnonymouslyCheckedChange = () => {
        this.setState({
            postAnonymously: !this.state.postAnonymously,
        });
    };


    /**
     * Handles input changes in textarea.
     * @function
     * @private
     * @param {Event} [event]
     * @param {object} data textarea data
     */
    _handleTextAreaChange = (event, data) => {
        this.textAreaValue = data.value;
        if (this.textAreaValue.length >= 10) {
            if (this.state.sendDisabled)
                this.setState({ sendDisabled: false });
        } else {
            if (!this.state.sendDisabled)
                this.setState({ sendDisabled: true });
        }
    };
    

    /**
     * Handles thumbnail selection change.
     * Removes deselected local images and sets new selection.
     * @function
     * @private
     * @param {string[]} newSelection array containing imageIds
     */
    _handleThumbnailSelectionChanged = (newSelection) => {
        const imagesToDelete = this.state.selectedImageIds.filter((id) =>
            id.startsWith('local') && newSelection.indexOf(id) === -1);
        this.props.imagesActions.removeImages(imagesToDelete);
        this.setState({
            selectedImageIds: newSelection
        });
    };


    /**
     * Handles submit and dispatches post action
     * @function
     * @private
     * @param {Event} [event]
     */
    _handleSubmitClick = (event) => {
        this.textAreaRef.current.ref.value = ""; // clear input
        if (this.props.isComment) {
            this.props.commentsActions.postComment(this.props.replyEntryId, this.props.replyCommentId,
                this.state.postAnonymously, this.textAreaValue, this.state.selectedImageIds);
        } else {
            this.props.entriesActions.postEntry(this.state.postAnonymously, this.textAreaValue, 
                this.state.selectedImageIds);
        }
        this._deleteImportedLocalImages();
        this._updateImageIds();
        this.setState({ submitted: true, sendDisabled: true, selectedImageIds: [] });
        if (this.props.onSubmit)
            this.props.onSubmit();
    };


    render() {
        if (this.props.replyIsDeleted) {
            return (
                <Message
                    error
                    header="Beitrag wurde gelöscht!"
                    content="Es nicht möglich auf gelöschte Inhalte zu antworten."
                />
            );
        }

        const {isComment, replyAuthorId, replyContent, replyTimeStamp, userId} = this.props;
        const {imageIds, inputImageModalOpen, postAnonymously, selectedImageIds, 
            sendDisabled, submitted} = this.state;
        const DimmerMainText = isComment ?
            "Kommentar versandt" : "Eintrag versandt";
        const DimmerSubText = isComment ?
            "Neuer Kommentar?" : "Neuer Eintrag?";
        const headerText = isComment ?
            "Antworten auf" : "Neuer Eintrag";
        const textAreaPlaceholder = isComment ? 
            "Antwort..." : "Feedback, Frage, ...";

        return (
            <Dimmer.Dimmable
                as={Card}
                dimmed={submitted}
                fluid
            >
                <Dimmer 
                    active={submitted}
                    onClick={this._handleDimmerClick}
                >
                    <Header as='h2' icon inverted>
                        <Icon name='envelope'/>
                        {DimmerMainText}
                        <Header.Subheader>
                            {DimmerSubText}
                        </Header.Subheader>
                    </Header>
                </Dimmer>
                <Card.Content>
                    <Header 
                        content={headerText}
                    />
                    {isComment && [
                        <Card.Description>
                            <Content
                                authorId={replyAuthorId}
                                content={replyContent}
                                timestamp={replyTimeStamp}
                            />
                        </Card.Description>,
                        <Divider/>,
                    ]}
                    <Form>
                        <Form.Field>
                            <Checkbox
                                checked={postAnonymously}
                                label="Anonym posten"
                                onChange={this._handlePostAnonymouslyCheckedChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <NameLabel
                                authorId={postAnonymously ? null : userId}
                            />
                        </Form.Field>
                        <Form.Field>
                            <TextArea
                                autoHeight
                                onChange={this._handleTextAreaChange}
                                placeholder={textAreaPlaceholder}
                                ref={this.textAreaRef}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Thumbnails
                                imageIds={imageIds}
                                onSelectionChanged={this._handleThumbnailSelectionChanged}
                                placeholderThumbnailProps={{
                                    hasDashedBorder: true,
                                    icon: 'image',
                                    onClick: this._handleImageAddClick,
                                } }
                                selectable
                                selectedIds={selectedImageIds}
                            />
                        </Form.Field>
                        <FormFieldAction>
                            <Button
                                content="Absenden"
                                disabled={sendDisabled}
                                icon="send"
                                primary
                                onClick={this._handleSubmitClick}                                
                            />
                        </FormFieldAction>
                    </Form>
                </Card.Content>
                {inputImageModalOpen &&
                    <InputImageModal
                        onClose={this._handleInputImageModalClose}
                        onSelect={this._handleInputImageModalSelect}
                    />
                }
            </Dimmer.Dimmable>
        );
    }
}


const mapStateToProps = (state, props) => {
    // commentId: '0' refers to root entry (entry itself)
    let replyData = null;

    if (props.replyCommentId && props.replyEntryId)
        replyData = props.replyCommentId === '0' ? 
            getEntry(state.entries, props.replyEntryId)
            : getComment(state.comments, props.replyCommentId);

    const isComment = props.replyCommentId && props.replyEntryId;
    // TODO fix routing (wrap this component by outer component that subscribes to entry/comment)
    if (isComment && !replyData)
        alert("Fehler: Beitrag nicht gefunden (subscription missing)!");
    return {
        isComment: !!isComment,
        replyAuthorId: replyData ? replyData.authorId : null,
        replyContent: replyData ? replyData.content : null,
        replyIsDeleted: replyData ? replyData.isDeleted : null,
        replyTimeStamp: replyData ? replyData.timestamp : null,
        screenshotIds: isComment ? null : getScreenshotIds(state.eventScreenshots),
        userId: getUserId(state.user),
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        commentsActions: bindActionCreators(commentsActions, dispatch),
        entriesActions: bindActionCreators(entriesActions, dispatch),
        imagesActions: bindActionCreators(imagesActions, dispatch),
    };
}


const ConnectedUserPostForm = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(UserPostForm);
export { ConnectedUserPostForm as UserPostForm };
