import styled from 'styled-components';
import { Button } from 'semantic-ui-react';


export const FloatingActionButton = styled(Button).attrs({
    circular: true,
    primary: true,
    size: "huge",
})`
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 50;
`;
