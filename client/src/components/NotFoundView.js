import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Embed, Button } from 'semantic-ui-react';


export class NotFoundView extends React.Component {
    render() {
        // empty span is hack to bypass Headers first-child pseudo selector
        return (
            <div>
                <span/>
                <Header as='h1' textAlign="center">404 - Verlaufen?!</Header>
                <Embed
                    active
                    placeholder='https://img.youtube.com/vi/SIaFtAKnqBU/hqdefault.jpg'
                    url='https://www.youtube.com/embed/SIaFtAKnqBU?rel=0&amp;controls=0&amp;showinfo=0&amp;iv_load_policy=3'
                />
                <br/>
                <Button
                    as={Link}
                    to='/'
                    content="Zur Startseite"
                    icon='chevron left'
                    fluid
                />
            </div>
        );
    }
}