import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as eventsActions from '../actions/events';
import { Segment, Header } from 'semantic-ui-react';
import { EventItem } from './EventItem';
import { NavBar } from './NavBar';
import { SegmentLoader } from '../components/SegmentLoader';
import { isInitialDictUpdatePending, getFullEventDict } from '../reducers/events';


class AllEventsView extends React.Component {
    /**
     * @property {object} eventDict eventDict object
     */
    static get propTypes() {
        return {
            isInitialDictUpdatePending: PropTypes.bool.isRequired,
            match: PropTypes.shape({
                params: PropTypes.shape({
                    eventId: PropTypes.string,
                }).isRequired,
            }).isRequired,
            eventDict: PropTypes.object.isRequired,
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
        const {eventDict, isInitialDictUpdatePending} = this.props;

        if (isInitialDictUpdatePending)
            return <SegmentLoader/>;

        return Object.keys(eventDict).sort((a, b) => {
            return eventDict[a].name > eventDict[b].name // sort by name
        }).map(key => {
            return (
                <EventItem
                    key={key}
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
                    mainContent={"Veranstaltungsverzeichnis"}
                    hideNavigation
                    hideSettings
                />
                <Header>
                    Alle Veranstaltungen
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
        eventDict: getFullEventDict(state.events),
        isInitialDictUpdatePending: isInitialDictUpdatePending(state.events),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        eventsActions: bindActionCreators(eventsActions, dispatch),        
    };
}


const ConnectedAllEventsView = connect(mapStateToProps, mapDispatchToProps)(AllEventsView);
export { ConnectedAllEventsView as AllEventsView };