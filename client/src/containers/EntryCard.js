import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as entriesActions from '../actions/entries';
import { getEntry } from '../reducers/entries';
import { Link } from 'react-router-dom';
import { Card, Label, Icon, Loader, Dimmer, Image, Button, Responsive } from 'semantic-ui-react';
import { UpDownVote } from '../components/UpDownVote';
import { SortedUserRolesByPriority } from './SortedUserRolesByPriority';
import { Content } from '../components/Content';
import { Thumbnails } from './Thumbnails';


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
        padding-left: 3px;
        padding-right: 3px;
        box-shadow: none !important;
    }

    &&&&:active {
        background: none !important;
    }
`;


class EntryCard extends React.Component {
    /**
     * @property {object} entriesActions object containing entries-actions
     * @property {String} [entry] entry object (injected by redux via id)
     * @property {String} [entryId] id of entry, if unset a Loader will be rendered
     * @property {String} [noLink=false] set true to disable redirect to comments-page on click
     */
    static get propTypes() {
        return {
            entriesActions: PropTypes.object.isRequired,
            entry: PropTypes.object,
            entryId: PropTypes.string,
            noLink: PropTypes.bool
        };
    };

    static get defaultProps() {
        return {
            noLink: false,
        };
    };


    _handleBookmarkToggle = () => {
        this.props.entriesActions.changeBookmark(this.props.entryId, !this.props.entry.bookmark);
    };


    _handleFollowToggle = () => {
        this.props.entriesActions.changeFollow(this.props.entryId, !this.props.entry.follow);
    };


    _handleVoteChanged = (vote) => {
        this.props.entriesActions.changeVote(this.props.entryId, vote);
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

        const {entryId, noLink} = this.props;
        const {authorId, bookmark, commentAttendingUserIds, commentCount, content, 
            follow, imageIds, liveAnswered, score, timestamp, vote } = this.props.entry;

        return (
            <CustomCard 
                fluid
            >
                <Card.Content
                    as={noLink ? undefined : Link}
                    to={noLink ? undefined : "/entries/" + entryId}
                >
                    <Card.Description>
                        <Content
                            authorId={authorId}
                            content={content}
                            timestamp={timestamp}
                        />
                        <Thumbnails imageIds={imageIds}/>
                    </Card.Description>
                    <CardMetaFlexAligned>
                            <span>
                                <Icon name="comments"/>
                                <span>{commentCount}</span>
                            </span>
                            <FlexStretch>
                                {commentAttendingUserIds &&
                                    <SortedUserRolesByPriority
                                        userIds={commentAttendingUserIds}
                                    />
                                }
                            </FlexStretch>
                            {liveAnswered &&
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
                        <ControlIconButton 
                            icon="bookmark" 
                            content={bookmark ? "Markiert" : "Markieren"} 
                            color={bookmark ? "blue" : undefined}
                            onClick={this._handleBookmarkToggle}                            
                        />
                    </ControlItem>
                    <ControlItem >
                        <ControlIconButton 
                            icon="bell"
                            content={follow ? "Folgend" : "Folgen"}
                            color={follow ? "blue" : undefined}
                            onClick={this._handleFollowToggle}                                                  
                        />
                    </ControlItem>
                    <ControlItem >
                        <UpDownVote
                            onVoteChange={this._handleVoteChanged}
                            score={score}
                            vote={vote}
                        />
                    </ControlItem>
                </CardContentSubControls>
            </CustomCard>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        entry: getEntry(state.entries, props.entryId),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        entriesActions: bindActionCreators(entriesActions, dispatch),        
    };
}


const ConnectedEntryCard = connect(mapStateToProps, mapDispatchToProps)(EntryCard);
export { ConnectedEntryCard as EntryCard };