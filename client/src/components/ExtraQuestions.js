import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'semantic-ui-react';
import { NameSpan } from '../containers/NameSpan';


const MDiv = styled.div`
    margin: .7rem 0;
`;


const CustomMessage = styled(Message)`
    &&& {
        margin: .7rem 0;
        padding: .75em 1em;
    }
`;


export class ExtraQuestions extends React.PureComponent {
    /**
     */
    static get propTypes() {
        return {
            authorId: PropTypes.string,
            extraQuestions: PropTypes.arrayOf(PropTypes.string),
            isPromptEnabled: PropTypes.bool,
        };
    };

    static get defaultProps() {
        return {};
    };


    render() {
        const { authorId, extraQuestions, isPromptEnabled } = this.props;
        const questions = extraQuestions ? extraQuestions : [];

        if (!questions.length)
            return null;

        let question = questions.reduce((acc, cur) => acc + "\n" + cur, "");
        question = question.trim();
        // ensure that question ends with a '?'
        if (question.slice(-1) !== '?')
            question += '?';

        if (!isPromptEnabled)
            return (
                <MDiv>{question}</MDiv>
            );

        // return (
        //     <MDiv><strong>{question}</strong></MDiv>
        // );
        return (
            <CustomMessage
                info
            >
                <i><NameSpan authorId={authorId}/> fragt:</i> {question}
            </CustomMessage>
        );
    }
}
