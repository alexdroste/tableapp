import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react'


// "&&&&..." is a required hack to bump specificity 
// in order to override semantic-uis !important rules, dev will not fix this (e.g. gh-#1591)
// TODO fix onclick design: colored has no bg, uncolored has grey bg (maybe make both grey bg)
const ButtonVote = styled(Button).attrs({
    basic: true
})`
    &&&&&&&& {
        margin: 0 !important;
        box-shadow: none !important;
        ${props => props.count && `
            padding: 0;
            opacity: 1 !important;
        `}
    }

    &&&&:active {
        background: none !important;
    }

    &&&&>i.icon {
        opacity: .8;
    }
`;


const Count = ButtonVote.extend.attrs({
    as: "span",
    disabled: true,
})`
    position: relative;
    width: 20px;

    &&&&&&&& {
        padding: 0;
        opacity: 1 !important;
    }
    
    &:before {
        content: attr(data-number);
        position: absolute;
        height: 100%;
        display:flex;
        justify-content:center;
        align-items:center;
        transform: translateX(-50%) translateX(10px);;
    }
`;


export class UpDownVote extends React.Component {
    /**
     * @property {string} [className] className
     * @property {function(vote: number)} onVoteChange vote changed callback (0: no vote, 1: up, -1: down)
     * @property {number} score score/points to display
     * @property {number} [vote=0] user-vote as number (0: no vote, >0: up, <0: down)
     */
    static get propTypes() {
        return {
            className: PropTypes.string,
            onVoteChange: PropTypes.func.isRequired,
            score: PropTypes.number.isRequired,
            vote: PropTypes.number,
        };
    };
    
    static get defaultProps() {
        return {
            vote: 0
        };
    };


    _handleVoteUpClick = (e) => {
        this.props.onVoteChange(this.props.vote > 0 ? 0 : 1);
    };


    _handleVoteDownClick = (e) => {
        this.props.onVoteChange(this.props.vote < 0 ? 0 : -1);
    };


    render() {
        const { score, vote } = this.props;

        return (
            <Button.Group className={this.props.className} size="small">
                <ButtonVote 
                    icon="arrow up" 
                    color={vote > 0 ? "blue" : null}
                    onClick={this._handleVoteUpClick}
                />
                <Count
                    data-number={score}
                    color={vote > 0 ? "blue" : (vote < 0 ? "red" : null)}
                />
                <ButtonVote 
                    icon="arrow down" 
                    color={vote < 0 ? "red" : null}
                    onClick={this._handleVoteDownClick}
                />
            </Button.Group>                      
        );
    }
}