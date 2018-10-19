import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as entriesActions from '../actions/entries';
import { getEntry } from '../reducers/entries';
import { getActiveEventUserPermissionLevel } from '../reducers/events';
import { PermissionLevelEnum } from '../PermissionLevelEnum';
import { EntryCard } from '../components/EntryCard';
import { EntryCardActionSheet } from '../components/EntryCardActionSheet';


class EntryCardContainer extends React.Component {
    /**
     * TODO
     * @property {object} entriesActions object containing entries-actions
     * @property {String} [entry] entry object (injected by redux via id)
     * @property {String} [entryId] id of entry, if unset a Loader will be rendered
     */
    static get propTypes() {
        return {
            activeEventUserPermissionLevel: PropTypes.number.isRequired,
            history: PropTypes.object.isRequired,
            entriesActions: PropTypes.object.isRequired,
            entry: PropTypes.object,
            entryId: PropTypes.string,
        };
    };

    static get defaultProps() {
        return {
            noLink: false,
        };
    };


    constructor(props) {
        super(props);

        this.state = {
            isActionSheetOpen: false,
        };
    }


    _handleActionSheetClose = (e) => {
        this.setState({
            isActionSheetOpen: false,
        });
    };


    _handleBookmarkToggle = () => {
        this.props.entriesActions.changeBookmark(this.props.entryId, !this.props.entry.isBookmarked);
        this.setState({
            isActionSheetOpen: false,
        });
    };


    _handleCommentClick = (e) => {
        this.props.history.push('/entries/' + this.props.entryId);
        this.props.history.push('/entries/' + this.props.entryId + '/0/new');
    };


    _handleContentClick = (e) => {
        this.props.history.push('/entries/' + this.props.entryId);
    };


    _handleDeleteClick = (e) => {
        this.props.entriesActions.deleteEntry(this.props.entryId);
        this.setState({
            isActionSheetOpen: false,
        });
    };

    
    _handleEditClick = (e) => {

        this.setState({
            isActionSheetOpen: false,
        });
    };


    _handleFollowToggle = () => {
        this.props.entriesActions.changeFollow(this.props.entryId, !this.props.entry.isFollowing);
        this.setState({
            isActionSheetOpen: false,
        });
    };


    _handleMoreClick = (e) => {
        this.setState({
            isActionSheetOpen: true,
        });
    };


    _handleVoteChange = (vote) => {
        this.props.entriesActions.changeVote(this.props.entryId, vote);
    };


    render() {
        const { activeEventUserPermissionLevel, entry } = this.props;
        const { isActionSheetOpen } = this.state;

        let canManageEntry = activeEventUserPermissionLevel >= PermissionLevelEnum.MODERATOR;
        if (entry) { 
            canManageEntry = canManageEntry || entry.isOwn;
        }
        
        return (
            <div>
                <EntryCard
                    entry={entry}
                    onCommentClick={this._handleCommentClick}
                    onContentClick={this._handleContentClick}
                    onMoreClick={this._handleMoreClick}
                    onVoteChange={this._handleVoteChange}
                />
                {entry &&
                    <EntryCardActionSheet
                        canManageEntry={canManageEntry}
                        isBookmarked={entry.isBookmarked}
                        isDeleted={entry.isDeleted}
                        isFollowing={entry.isFollowing}
                        isOpen={isActionSheetOpen}
                        onBookmarkToggle={this._handleBookmarkToggle}
                        onClose={this._handleActionSheetClose}
                        onDeleteClick={this._handleDeleteClick}
                        onEditClick={this._handleEditClick}
                        onFollowToggle={this._handleFollowToggle}
                    />
                }
            </div>
        )
    }
}


const mapStateToProps = (state, props) => {
    return {
        activeEventUserPermissionLevel: getActiveEventUserPermissionLevel(state.events),
        entry: getEntry(state.entries, props.entryId),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        entriesActions: bindActionCreators(entriesActions, dispatch),        
    };
}


const ConnectedEntryCardContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(EntryCardContainer));
export { ConnectedEntryCardContainer as EntryCardContainer };
