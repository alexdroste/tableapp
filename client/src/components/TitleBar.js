import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Modal, List, TransitionablePortal } from 'semantic-ui-react';


const BarWrapper = styled.div`
    -webkit-app-region: drag;
    height: 22px; // TitleBar height must also be defined in NavBar.FixedTop.top & in _handleDocumentClickCapture()
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5000;
    background: white;
    background-image: linear-gradient(180deg, rgb(235, 235, 235) 0%, rgb(225, 225, 225) 100%);
    display: flex;
`;


const TitleSpan = styled.span`
    pointer-events: none;
    user-select: none;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;


export class TitleBar extends React.PureComponent {
    static get propTypes() {
        return {
        };
    };

    static get defaultProps() {
        return {
            isCentered: true,
        };
    };


    componentWillMount() {
        document.addEventListener("click", this._handleDocumentClickCapture, true);
    }


    componentWillUnmount() {
        document.removeEventListener("click", this._handleDocumentClickCapture);
    }


    // needed to fix semantic-ui documentclick capture
    _handleDocumentClickCapture = (e) => {
        // check if click was on titlebar by checking y-val of click
        if (e.y < 22) {
            e.stopPropagation();
            e.preventDefault();
        }
    };


    render() {
        return (
            <BarWrapper>
                <TitleSpan>
                    table
                </TitleSpan>
            </BarWrapper>
        );
    }
}