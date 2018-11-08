import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox } from 'semantic-ui-react';
import { CheckboxWithInput } from './CheckboxWithInput';


const FlexSubDivs = styled.div`
    &&& > * {
        display: flex;
        margin: .5em 0 .65em 0;
    }
`;


export class CheckboxList extends React.PureComponent {
    /**
     */
    static get propTypes() {
        return {
            data: PropTypes.arrayOf(PropTypes.shape({
                isChecked: PropTypes.bool,
                isInput: PropTypes.bool,
                label: PropTypes.string,
            })).isRequired,
            onCheckedChange: PropTypes.func.isRequired,
            onValueChange: PropTypes.func,
        };
    };

    static get defaultProps() {
        return {};
    };


    constructor(props) {
        super(props);

        this._inputRefs = {};
    }


    clearInputs = () => {
        Object.keys(this._inputRefs).forEach((key) => {
            if (this._inputRefs[key] && this._inputRefs[key].clearInput)
                this._inputRefs[key].clearInput();
        });
    };


    _handleCheckedChange = (idx) => (e) => {
        this.props.onCheckedChange(idx, !this.props.data[idx].isChecked);
    };


    _handleValueChange = (idx) => (e, value) => {
        if (this.props.onValueChange)
            this.props.onValueChange(idx, value);
    };


    _setInputRef = (idx) => (ref) => {
        this._inputRefs[idx] = ref;
    };


    render() {
        const { data } = this.props;

        return (
            <FlexSubDivs>
                {data.map((dat, idx) => {
                    if (dat.isInput)
                        return (
                            <CheckboxWithInput
                                isChecked={dat.isChecked}
                                onCheckedChange={this._handleCheckedChange(idx)}
                                onValueChange={this._handleValueChange(idx)}
                                placeholder={dat.label}
                                ref={this._setInputRef(idx)}
                            />
                        );
                    
                    return (
                        <Checkbox
                            checked={dat.isChecked}
                            label={dat.label}
                            onChange={this._handleCheckedChange(idx)}
                        />
                    );
                })}
            </FlexSubDivs>
        )
    }
}
