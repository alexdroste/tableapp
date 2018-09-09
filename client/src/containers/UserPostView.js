import React from 'react';
import PropTypes from 'prop-types';
import { UserPostForm } from '../containers/UserPostForm';
import { NavBar } from '../containers/NavBar';


export class UserPostView extends React.Component {
    /**
     * @property {String} [match.params.commentId] id of comment to reply to (injected by react-router)
     * @property {String} [match.params.entryId] id of entry to reply to (injected by react-router)
     */
    static get propTypes() {
        return {
            match: PropTypes.shape({
                    params: PropTypes.shape({
                        commentId: PropTypes.string,
                        entryId: PropTypes.string,
                    }).isRequired,
                }).isRequired,
        };
    };


    static get defaultProps() {
        return {};
    };


    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }


    _handleSubmit = () => {
        this.context.router.history.goBack();
    };


    render() {
        const {commentId, entryId} = this.props.match.params;
        
        return (
            <div>
                <NavBar
                    hasGoBack
                    hideNavigation
                    mainContent={commentId && entryId ? "Neuer Kommentar" : "Neuer Eintrag"}
                />
                <UserPostForm
                    onSubmit={this._handleSubmit}
                    replyCommentId={commentId}
                    replyEntryId={entryId}
                />
            </div>
        );
    }
}
