import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as commentsActions from '../actions/comments';
import { getComment } from '../reducers/comments';
import { getActiveEventUserPermissionLevel } from '../reducers/events';
import { CommentCard } from '../components/CommentCard';
import { CommentCardActionSheet } from '../components/CommentCardActionSheet';
import { PermissionLevelEnum } from '../PermissionLevelEnum';
import { Confirm } from '../components/Confirm';


/**
 * Card for displaying a comment.
 * Comments can be displayed as hierarchy if children are supplied as children
 * to component.
 * 
 * __Exported component is connected to redux-store. Some props are injected by HOC.__
 * @param {object} props
 * @param {*} [props.children] furhter content to render inside comment
 * @param {object} [props.comment] comment object (injected by redux via commentId)
 * @param {object} props.commentsActions object containing bound commentsActions (injected by redux)
 * @param {String} props.commentId id of comment to render
 * @param {String} props.entryId id of entry comment refers to
 * @param {boolean} [props.isToplevel=false] true indicates that card is on toplevel
 */
class CommentCardContainer extends React.Component {
    static get propTypes() {
        return {
            children: PropTypes.any,
            comment: PropTypes.object,
            commentsActions: PropTypes.object.isRequired,
            commentId: PropTypes.string.isRequired,
            entryId: PropTypes.string.isRequired,
            eventId: PropTypes.string.isRequired,
            history: PropTypes.object.isRequired,
            isToplevel: PropTypes.bool,
        };
    };

    static get defaultProps() {
        return {
            toplevel: false,
        };
    };


    constructor(props) {
        super(props);

        this.state = {
            isActionSheetOpen: false,
            isDeleteConfirmOpen: false,
        };
    }


    _handleActionSheetClose = (e) => {
        this.setState({
            isActionSheetOpen: false,
        });
    };


    _handleDeleteClick = (e) => {
        this.setState({
            isActionSheetOpen: false,
        });
    };


    _handleDeleteClick = (e) => {
        this.setState({
            isActionSheetOpen: false,
            isDeleteConfirmOpen: true,
        });
    };


    _handleDeleteConfirmAcceptClick = (e) => {
        this.props.commentsActions.deleteComment(this.props.entryId, this.props.commentId);
        this.setState({
            isDeleteConfirmOpen: false,
        });
    }


    _handleDeleteConfirmCancelClick = (e) => {
        this.setState({
            isDeleteConfirmOpen: false,
        });
    }


    _handleMoreClick = (e) => {
        this.setState({
            isActionSheetOpen: true,
        });
    };


    _handleReplyClick = (e) => {
        this.props.history.push(`/${this.props.eventId}/${this.props.entryId}/${this.props.commentId}/new`);
    };


    _handleVoteChange = (vote) => {
        this.props.commentsActions.changeVote(this.props.entryId, this.props.commentId, vote);
    };


    render() {
        const { activeEventUserPermissionLevel, children, comment, isToplevel } = this.props;
        const { isActionSheetOpen, isDeleteConfirmOpen } = this.state;

        let canManageComment = activeEventUserPermissionLevel >= PermissionLevelEnum.MODERATOR;
        if (comment) {
            canManageComment = canManageComment || comment.isOwn;
        }

        return (
            <div>
                <CommentCard
                    children={children}
                    comment={comment}
                    isToplevel={isToplevel}
                    onMoreClick={this._handleMoreClick}
                    onReplyClick={this._handleReplyClick}
                    onVoteChange={this._handleVoteChange}
                />
                {comment &&
                    <CommentCardActionSheet
                        canManageComment={canManageComment}
                        isDeleted={comment && comment.isDeleted}
                        isOpen={isActionSheetOpen}
                        onClose={this._handleActionSheetClose}
                        onDeleteClick={this._handleDeleteClick}
                    />
                }
                <Confirm
                    confirmText='Löschen'
                    content='Willst Du den Kommentar wirklich löschen?'
                    hasCancel
                    headerText='Kommentar löschen'
                    isNegative
                    isOpen={isDeleteConfirmOpen}
                    onCancel={this._handleDeleteConfirmCancelClick}
                    onConfirm={this._handleDeleteConfirmAcceptClick}
                />
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        activeEventUserPermissionLevel: getActiveEventUserPermissionLevel(state.events),
        comment: getComment(state.comments, props.commentId),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        commentsActions: bindActionCreators(commentsActions, dispatch), 
    };
}


const ConnectedCommentCardContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(CommentCardContainer));
export { ConnectedCommentCardContainer as CommentCardContainer };