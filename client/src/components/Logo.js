import React from 'react';
import { Image } from 'semantic-ui-react';


export class Logo extends React.PureComponent {
    render() {
        return (
            <Image
                centered
                size="small"
                src="/assets/img/logo-table.png"
            />
        );
    }
}
