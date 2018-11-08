import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'semantic-ui-react';


const MDiv = styled.div`
    margin: .7rem 0;
`;


export class ExtraQuestions extends React.PureComponent {
    /**
     */
    static get propTypes() {
        return {
            extraQuestions: PropTypes.arrayOf(PropTypes.string),
            isPromptEnabled: PropTypes.bool,
        };
    };

    static get defaultProps() {
        return {};
    };


    render() {
        const { extraQuestions, isPromptEnabled } = this.props;
        const questions = extraQuestions ? extraQuestions : [];

        if (!questions.length)
            return null;

        const question = questions.reduce((acc, cur) => acc + "\n" + cur, "");

        if (!isPromptEnabled)
            return (
                <MDiv>{question}</MDiv>
            );

        return (
            <MDiv><strong>{question}</strong></MDiv>
        );
        return (
            <Message
                warning
                content={question}
            />
        );
    }
}
