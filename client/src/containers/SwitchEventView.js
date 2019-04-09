import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Segment, Header, Button } from 'semantic-ui-react';
import { SegmentLoader } from '../components/SegmentLoader';
import { EventItem } from './EventItem';
import { NavBar } from './NavBar';
import { isInitialDictUpdatePending, getActiveEventId, getEventDict } from '../reducers/events';


class SwitchEventView extends React.Component {
    /**
     * @property {string} [activeEventId] id of active event (injected by redux)
     * @property {object} eventDict eventDict object (injected by redux)
     */
    static get propTypes() {
        return {
            activeEventId: PropTypes.string,
            eventDict: PropTypes.object.isRequired,
            isInitialDictUpdatePending: PropTypes.bool.isRequired,
        };
    };

    static get defaultProps() {
        return {};
    };


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
        const { activeEventId } = this.props;
        const hasGoBack = !!activeEventId;

        return (
            <div>
                <NavBar
                    hasGoBack={hasGoBack}
                    mainContent={"Veranstaltung wechseln"}
                />
                <Header>
                    Meine Veranstaltungen
                </Header>
                <Segment.Group>
                    {this.renderEventItems()}
                </Segment.Group>
                <Button
                    as={Link}
                    content='Alle Veranstaltungen durchsuchen'
                    fluid
                    icon='search'
                    to='/searchevents'
                />
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        activeEventId: getActiveEventId(state.events),
        eventDict: getEventDict(state.events),
        isInitialDictUpdatePending: isInitialDictUpdatePending(state.events),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {

    };
}


const ConnectedSwitchEventView = connect(mapStateToProps, mapDispatchToProps)(SwitchEventView);
export { ConnectedSwitchEventView as SwitchEventView };