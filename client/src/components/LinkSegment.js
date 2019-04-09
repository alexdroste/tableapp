import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';


export const LinkSegment = styled(Segment).attrs({
    as: Link
})`
    display: block;
`;
