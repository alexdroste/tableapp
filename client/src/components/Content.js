import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TimeStamp } from './TimeStamp';
import { NameLabel } from '../containers/NameLabel';


const Meta = styled.div`
    display: flex;
    align-items: center;
`;


const Main = styled.div`
    margin: .7rem 0;
    white-space: pre-wrap;
    word-wrap: break-word;
`;


const TimeStampSub = styled(TimeStamp)`
    vertical-align: middle;
    line-height: 1;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
    margin-left: .5em;
`;


export class Content extends React.Component {
    /**
     * @property {String} [authorId] id of content author
     * @property {string|object} content content to render
     * @property {number} [timestamp] timestamp of content update
     */
    static get propTypes() {
        return {
            authorId: PropTypes.string,
            content: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.object
            ]),
            isDeleted: PropTypes.bool,
            timestamp: PropTypes.number,
        };
    };

    static get defaultProps() {
        return {};
    };


    render() {
        if (this.props.isDeleted) {
            return (
                <Main>
                    <i>Beitrag wurde gelöscht.</i>
                </Main>
            );
        }

        const { authorId, content, timestamp } = this.props;

        return (
            <div>
                <Meta>
                    <NameLabel
                        authorId={authorId}
                    />
                    {timestamp &&
                    <TimeStampSub
                        timestamp={timestamp}
                    />}
                </Meta>
                <Main>
                    {content}
                </Main>
            </div>            
        );
    }
}
