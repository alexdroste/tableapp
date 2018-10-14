import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Image } from 'semantic-ui-react';


const Group = styled(Image.Group)`
    ${props => props['data-iscentered'] && 'text-align: center;'}
`;


// TODO
export class ThumbnailGroup extends React.Component {
    static get propTypes() {
        return {
            children: PropTypes.object,
            isCentered: PropTypes.bool,
        };
    };

    static get defaultProps() {
        return {
            isCentered: false,
        };
    };


    render() {
        const { children, isCentered } = this.props

        return (
            <Group
                data-iscentered={isCentered}
            >
                {children}
            </Group>
        );
    }
}
