import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox, Input } from 'semantic-ui-react';


const CustomCheckbox = styled(Checkbox)`
    width: 1.85714em;
`;


const FlexDiv = styled.div`
    display: flex;
`;


const SmallInput = styled(Input)`
    transform: translateY(-5px);
    &&& > input {
        padding: 0.25em 0.4em;
    }
`;


export class CheckboxWithInput extends React.PureComponent {
    /**
     */
    static get propTypes() {
        return {
            isChecked: PropTypes.bool,
            onCheckedChange: PropTypes.func.isRequired,
            onValueChange: PropTypes.func.isRequired,
            placeholder: PropTypes.string,
        };
    };

    static get defaultProps() {
        return {};
    };


    constructor(props) {
        super(props);

        this._inputRef = React.createRef();
    }


    clearInput = () => {
        if (this._inputRef.current)
            this._inputRef.current.inputRef.value = '';
    };


    _handleCheckedChange = (e) => {
        if (this._inputRef.current.inputRef.value.length)
            return this.props.onCheckedChange(e, !this.props.isChecked);
        if (this._inputRef.current)
            this._inputRef.current.focus();
    };


    _handleInputChange = (e, data) => {
        const hasInput = !!data.value.length;
        // if user enters text box will send Checked=true, 
        // if user deletes all text box will send Checked=false
        if (this.props.isChecked !== hasInput)
            this.props.onCheckedChange(e, hasInput);
        this.props.onValueChange(e, data.value);
    };


    render() {
        const { isChecked, placeholder } = this.props;

        return (
            <FlexDiv>
                <CustomCheckbox
                    checked={isChecked}
                    onChange={this._handleCheckedChange}
                />
                <SmallInput
                    innerRef={this._inputRef}
                    maxLength={120}
                    onChange={this._handleInputChange}
                    placeholder={placeholder}
                />
            </FlexDiv>
        )
    }
}
