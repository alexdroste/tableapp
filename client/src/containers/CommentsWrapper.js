import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commentsActions from '../actions/comments';
import * as entriesActions from '../actions/entries';
import { CommentsView } from './CommentsView';
import { UserPostView } from './UserPostView';
import { NotFoundView } from '../components/NotFoundView';
import { getEntry } from '../reducers/entries';
import { Dimmer, Loader } from 'semantic-ui-react';
import { getComment, isInitialLoadPending } from '../reducers/comments';


/**
 * Main routing view, if active event is selected.
 * 
 * __Exported component is connected to router.__
 * __Exported component is connected to redux-store. Some props are injected by HOC.__
 * @param {object} props
 * @param {object} props.entriesActions object containing bound entriesActions (injected by redux)
 * @param {boolean} props.isDesktopApp indicates if app is running in electron environment (injected by redux)
 * @param {boolean} props.isSwitchActiveEventPending indicates if currently switching active event (injected by redux)
 */
class CommentsWrapper extends React.Component {
    static get propTypes() {
        return {
        };
    };

    static get defaultProps() {
        return {};
    };

    // static get contextTypes() {
    //     return {
    //         router: PropTypes.object.isRequired
    //     };
    // }


    render() {
        const { isCommentExistent, isInitialLoadPending } = this.props;

        if (isInitialLoadPending)
            return (
                <Dimmer
                    active
                    page
                    inverted
                >
                    <Loader inverted/>
                </Dimmer>
            );

        if (!isCommentExistent)
            return (
                <Route path="*" component={NotFoundView} status={404}/>
            );

        return (
            <div>
                <Switch>
                    <Route path="/:eventId/:entryId/:commentId/new" component={UserPostView}/>,
                    <Route path="*" component={NotFoundView} status={404}/>
                </Switch>
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        isCommentExistent: props.match.params.commentId === '0' || !!getComment(state.comments, props.match.params.commentId),
        isInitialLoadPending: isInitialLoadPending(state.comments),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {};
};


const ConnectedCommentsWrapper = withRouter(connect(mapStateToProps, mapDispatchToProps)(CommentsWrapper));
export { ConnectedCommentsWrapper as CommentsWrapper };