import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Comment, Button, Dimmer, Loader, Image } from 'semantic-ui-react';
import { UpDownVote } from '../components/UpDownVote';
import { Content } from '../components/Content';
import { Thumbnails } from '../containers/Thumbnails';


const CustomComment = styled(Comment)`
    &&&&& {
        margin: 1.25em 0 1.25em 1px;
        padding: 0 0 0 1em;
        box-shadow: -2px 0px 0px 0px rgba(0,0,0,.1);
    }

    ${props => props['data-toplevel'] && `
        &&&&& {
            margin-bottom: 2.5em;
            background: white;
            border-radius: .28571429rem;
            padding-top: 1em;
            padding-bottom: 1px;
            padding-right: 1em;
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
 * @param {object} [props.comment] comment object
 * @param {boolean} [props.isToplevel=false] true indicates that card is on toplevel
 * @todo
 */
export class CommentCard extends React.Component {
    static get propTypes() {
        return {
            children: PropTypes.any,
            comment: PropTypes.shape({
                authorId: PropTypes.string,
                content: PropTypes.string,
                imageIds: PropTypes.arrayOf(PropTypes.string).isRequired,
                isDeleted: PropTypes.bool,
                score: PropTypes.number.isRequired,
                timestamp: PropTypes.number,
                vote: PropTypes.number,
            }),
            isToplevel: PropTypes.bool,
            onMoreClick: PropTypes.func.isRequired,
            onReplyClick: PropTypes.func.isRequired,
            onVoteChange: PropTypes.func.isRequired,
        };
    };

    static get defaultProps() {
        return {
            isToplevel: false,
        };
    };


    render() {
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

        const { authorId, content, imageIds, isDeleted, score, timestamp, vote } = this.props.comment;

        const { children, isToplevel, onMoreClick, onReplyClick, onVoteChange } = this.props;

        return (
            <CustomComment 
                data-toplevel={isToplevel}
            >
                <Comment.Content>
                    <Content
                        authorId={authorId}
                        content={content}
                        isDeleted={isDeleted}
                        timestamp={timestamp}
                    />
                    <Thumbnails imageIds={imageIds}/>
                    {!isDeleted &&
                        <SubActions>
                            <ActionButton
                                icon="ellipsis horizontal"
                                onClick={onMoreClick}
                            />
                            <VerticalDivider/>
                            <ActionButton 
                                icon="reply" 
                                content={isToplevel ? "Antworten" : null} 
                                onClick={onReplyClick}
                            />
                            <VerticalDivider/>
                            <UpDownVote
                                onVoteChange={onVoteChange}
                                score={score}
                                vote={vote}
                            />
                        </SubActions>
                    }
                </Comment.Content>
                {children}
            </CustomComment>
        );
    }
}
