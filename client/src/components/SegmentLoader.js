import React from 'react';
import { Segment, Loader } from 'semantic-ui-react';


export class SegmentLoader extends React.PureComponent {
    render() {
        return (
            <Segment>
                <br/><br/>
                <Loader active/> 
            </Segment> 
        );
    }
}
