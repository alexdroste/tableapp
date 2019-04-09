import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';


const InnerWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    & > :first-child {
        flex: 1;
    }

    & > :last-child {
        line-height: 14px;
    }
`;


export class InnerSegmentWithIcon extends React.Component {
    render() {
        const { children, icon } = this.props;

        return (
            <InnerWrapper>
                <div>{children}</div>
                <Icon name={icon}/>
            </InnerWrapper>
        )
    }
}
