import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as eventsActions from '../actions/events';
import { Segment, Header } from 'semantic-ui-react';
import { EventItem } from './EventItem';
import { NavBar } from './NavBar';
import { SegmentLoader } from '../components/SegmentLoader';
import { isInitialDictUpdatePending, getUnjoinedEventDict } from '../reducers/events';


class JoinEventView extends React.Component {
    /**
     * @property {object} unjoinedEventDict eventDict object (injected by redux)
     */
    static get propTypes() {
        return {
            isInitialDictUpdatePending: PropTypes.bool.isRequired,
            match: PropTypes.shape({
                params: PropTypes.shape({
                    eventId: PropTypes.string,
                }).isRequired,
            }).isRequired,
            unjoinedEventDict: PropTypes.object.isRequired,
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


    // constructor(props) {
    //     super(props);

    //     this.state = {
    //     };
    // }


    componentDidMount() {
        this.props.eventsActions.subscribeFullEventDict();
    }


    componentWillUnmount() {
        this.props.eventsActions.unsubscribeFullEventDict();
    }


    renderEventItems = () => {
        const eventId = this.props.match.params.eventId;
        const {unjoinedEventDict, isInitialDictUpdatePending} = this.props;

        if (isInitialDictUpdatePending)
            return <SegmentLoader/>;

            
        return Object.keys(unjoinedEventDict).sort((a, b) => {
            return unjoinedEventDict[a].name > unjoinedEventDict[b].name // sort by name
        }).map(key => {
            return (
                <EventItem
                    key={key}
                    defaultOpen={key === eventId}
                    eventId={key}
                />
            );
        });
    };


    render() {
        return (
            <div>
                <NavBar
                    hasGoBack
                    mainContent={"Veranstaltung beitreten"}
                    hideNavigation
                    hideSettings
                />
                <Header>
                    Weitere Veranstaltungen
                </Header>
                <Segment.Group>
                    {this.renderEventItems()}
                </Segment.Group>
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        unjoinedEventDict: getUnjoinedEventDict(state.events),
        isInitialDictUpdatePending: isInitialDictUpdatePending(state.events),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        eventsActions: bindActionCreators(eventsActions, dispatch),        
    };
}


const ConnectedJoinEventView = connect(mapStateToProps, mapDispatchToProps)(JoinEventView);
export { ConnectedJoinEventView as JoinEventView };