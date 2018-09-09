import React from 'react';
import { Header, Message } from 'semantic-ui-react';
import { NavBar } from './NavBar';


export class PollsView extends React.Component {
    render() {
        return (
            <div>
                <NavBar/>
                <Header content="Umfragen"/>
                <Message>
                    <Message.Header>Keine Einträge</Message.Header>
                </Message>
            </div>
        );
    }
}