import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Label, Icon, Loader, Dimmer, Image, Button, Responsive } from 'semantic-ui-react';
import { UpDownVote } from '../components/UpDownVote';
import { SortedUserRolesByPriority } from '../containers/SortedUserRolesByPriority';
import { Content } from '../components/Content';
import { Thumbnails } from '../containers/Thumbnails';
import { ExtraQuestions } from './ExtraQuestions';


const CustomCard = styled(Card)`
    &&& {
        margin: .5em 1px;
        width: calc(100% - 2px); /* margin left 1px + margin right 1px */
    }
`;


const CardContentSubControls = styled(Card.Content).attrs({
    extra: true
})`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;


const ControlItem = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: ${props => props.left ? "flex-start" : (props.right ? "flex-end" : "center")};
`;


const CardMetaFlexAligned = styled(Card.Meta)`
    display: flex;
    align-items: center;
`;


const FlexStretch = styled.div`
    flex: 1;
    display:flex;
    align-items:center;
    flex-wrap: wrap;
    overflow: hidden;
`;


const ControlIconButton = styled(Button).attrs({
    basic: true,
    size: "small"
})`
    &&&&&&&& {
        white-space: nowrap;
        padding-left: 3px;
        padding-right: 3px;
        box-shadow: none !important;
    }

    &&&&:active {
        background: none !important;
    }
`;


export class EntryCard extends React.PureComponent {
    /**
     * @property {object} [entry] entry object (injected by redux via id)
     * @todo
     */
    static get propTypes() {
        return {
            entry: PropTypes.shape({
                authorId: PropTypes.string,
                commentAttendingUserIds: PropTypes.arrayOf(PropTypes.string),
                commentCount: PropTypes.number.isRequired,
                content: PropTypes.string,
                extraQuestions: PropTypes.arrayOf(PropTypes.string), // extra-code for prompts
                imageIds: PropTypes.arrayOf(PropTypes.string),
                isDeleted: PropTypes.bool,
                isLiveAnswered: PropTypes.bool,
                score: PropTypes.number.isRequired,
                timestamp: PropTypes.number,
                vote: PropTypes.number,
            }),
            isPromptEnabled: PropTypes.bool, // extra-code for prompts
            onCommentClick: PropTypes.func.isRequired,
            onContentClick: PropTypes.func.isRequired,
            onMoreClick: PropTypes.func.isRequired,
            onVoteChange: PropTypes.func.isRequired,
        };
    };

    static get defaultProps() {
        return {};
    };


    render() {
        // render loader with wireframe if entry is empty
        if (!this.props.entry)
            return (
                <Dimmer.Dimmable as={CustomCard} fluid dimmed>
                    <Dimmer inverted active>
                        <Loader inverted />
                    </Dimmer>
                    <Card.Content>
                        <Image src='/assets/img/paragraph-wireframe.png' />
                    </Card.Content>
                </Dimmer.Dimmable>
            );

        const { isPromptEnabled, onContentClick, onCommentClick, onMoreClick, onVoteChange } = this.props; // extra-code for prompts

        const { authorId, commentAttendingUserIds, commentCount, content, extraQuestions, // extra-code for prompts 
            imageIds, isDeleted, isLiveAnswered, score, timestamp, vote } = this.props.entry;

        return (
            <CustomCard 
                fluid
            >
                <Card.Content
                    onClick={onContentClick}
                >
                    <Card.Description>
                        <Content
                            authorId={authorId}
                            content={content}
                            isDeleted={isDeleted}
                            timestamp={timestamp}
                        />
                        <ExtraQuestions
                            extraQuestions={extraQuestions}
                            isPromptEnabled={isPromptEnabled}
                        />
                        <Thumbnails imageIds={imageIds}/>
                    </Card.Description>
                    <CardMetaFlexAligned>
                            <span>
                                <Icon name="comments"/>
                                <span>{commentCount}</span>
                            </span>
                            <FlexStretch>
                                <SortedUserRolesByPriority
                                    userIds={commentAttendingUserIds}
                                />
                            </FlexStretch>
                            {isLiveAnswered &&
                                <Label 
                                    color="blue"
                                    basic
                                >
                                In Veranstaltung <Responsive as="span" maxWidth={460}><br/></Responsive>beantwortet
                                </Label>
                            }
                    </CardMetaFlexAligned>
                </Card.Content>
                <CardContentSubControls>
                    <ControlItem>
                        <UpDownVote
                            disabled={isDeleted}
                            onVoteChange={onVoteChange}
                            score={score}
                            vote={vote}
                        />
                    </ControlItem>
                    <ControlItem>
                        <ControlIconButton 
                            icon='ellipsis horizontal' 
                            onClick={onMoreClick}                            
                        />
                    </ControlItem>
                    <ControlItem>
                        <ControlIconButton 
                            icon='comment'
                            content='Kommentieren'
                            disabled={isDeleted}
                            onClick={onCommentClick}                                                  
                        />
                    </ControlItem>
                </CardContentSubControls>
            </CustomCard>
        );
    }
}
