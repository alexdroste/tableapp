import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commentsActions from '../actions/comments';
import { Link } from 'react-router-dom';
import { getComment } from '../reducers/comments';
import { Comment, Button, Dimmer, Loader, Image } from 'semantic-ui-react';
import { UpDownVote } from '../components/UpDownVote';
import { Content } from '../components/Content';
import { Thumbnails } from './Thumbnails';


const CustomComment = styled(Comment)`
    &&&&& {
        margin: 1.25em 0 1.25em 1px;
        padding: 0 0 0 1em;
        box-shadow: -2px 0px 0px 0px rgba(0,0,0,.1);
        ${props => props['data-toplevel'] && "margin-bottom: 2.5em;"}
    }

    ${props => props['data-toplevel'] && `
        &&&&& {
            margin-bottom: 2.5em;
            background: white;
            border-radius: .28571429rem;
            padding-top: 1em;
            padding-bottom: 1px;
        }
    `}
`;


const SubActions = styled(Comment.Actions)`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: -0.7rem;
`;


const ActionButton = styled(Button).attrs({
    basic: true,
    size: "small"
})`
    &&&&&&&& {
        box-shadow: none !important;
        margin: 0;
        padding-left: 10px;
        padding-right: 10px;
    }

    &&&&:active {
        background: none !important;
    }
`;


const VerticalDivider = styled.span`
    border-left: 1px solid rgba(0,0,0,0.1);
    margin-left: 3px;
    margin-right: 3px;
    height: 1.75em;
`;


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
 * @param {String} props.parentId id of parent comment ('0' for root)
 * @param {boolean} [props.toplevel=false] true indicates that card is on toplevel
 */
class CommentCard extends React.Component {
    static get propTypes() {
        return {
            children: PropTypes.any,
            comment: PropTypes.object,
            commentsActions: PropTypes.object.isRequired,
            commentId: PropTypes.string.isRequired,
            entryId: PropTypes.string.isRequired,
            parentId: PropTypes.string.isRequired,
            toplevel: PropTypes.bool,
        };
    };

    static get defaultProps() {
        return {
            toplevel: false,
        };
    };


    /**
     * Handles vote change by dispatching action.
     * @function
     * @private
     */
    _handleVoteChanged = (vote) => {
        this.props.commentsActions.changeVote(this.props.entryId, this.props.commentId, vote);
    };


    render() {
        const { toplevel } = this.props;
        // render loader with wireframe if comment is empty
        if (!this.props.comment)
            return (
                <Dimmer.Dimmable as={Comment} dimmed>
                    <Dimmer inverted active>
                        <Loader inverted />
                    </Dimmer>
                    <Comment.Content>
                        <Image src='/assets/img/short-paragraph-wireframe.png' />
                    </Comment.Content>
                </Dimmer.Dimmable>
            );

        const { authorId, content, imageIds, score, timestamp, vote } = this.props.comment;
        const { children, entryId, commentId } = this.props;

        return (
            <CustomComment 
                data-toplevel={toplevel}
            >
                <Comment.Content>
                    <Content
                        authorId={authorId}
                        content={content}
                        timestamp={timestamp}
                    />
                    <Thumbnails imageIds={imageIds}/>
                    <SubActions>
                        <ActionButton 
                            as={Link}
                            icon="reply" 
                            content="Antworten" 
                            to={`/entries/${entryId}/${commentId}/new`}                            
                        />
                        <VerticalDivider/>
                        <UpDownVote
                            onVoteChange={this._handleVoteChanged}
                            score={score}
                            vote={vote}
                        />
                    </SubActions>
                </Comment.Content>
                {children}
            </CustomComment>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        comment: getComment(state.comments, props.commentId),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        commentsActions: bindActionCreators(commentsActions, dispatch), 
    };
}


const ConnectedCommentCard = connect(mapStateToProps, mapDispatchToProps)(CommentCard);
export { ConnectedCommentCard as CommentCard };