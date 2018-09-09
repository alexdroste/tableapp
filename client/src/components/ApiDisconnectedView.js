import React from 'react';
import { Dimmer, Header, Loader } from 'semantic-ui-react';


export class ApiDisconnectedView extends React.Component {
    render() {
        return (
            <Dimmer
                active
                page
            >
                <Loader
                    indeterminate
                >
                    <Header as='h2' icon inverted>
                        Verbindung zum Server verloren.
                        <Header.Subheader>Warte auf Verbindung...</Header.Subheader>
                    </Header>
                </Loader>
            </Dimmer>
        );
    }
}
