import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as eventsActions from '../actions/events';
import { Header, Button, Form, Segment, Input } from 'semantic-ui-react';
import { FormFieldAction } from '../components/FormFieldAction';
import { getActiveEventName, getActiveEventId } from '../reducers/events'; 
import { Confirm } from '../components/Confirm';


const MIN_TITLE_LENGTH = 8;


class ManageEventNameForm extends React.Component {
    /**
     * @property {string} activeEventName title of active event (injected by redux)
     */
    static get propTypes() {
        return {
            activeEventName: PropTypes.string.isRequired,
        };
    };

    static get defaultProps() {
        return {};
    };


    constructor(props) {
        super(props);

        this.state = {
            isChangeConfirmOpen: false,
            title: props.activeEventName,
        };
    }


    _handleTitleChange = (e, data) => {
        this.setState({
            title: data.value
        });
    };


    _handleResetClick = () => {
        this.setState({
            title: this.props.activeEventName,
        });
    };


    _handleSaveClick = () => {
        this.setState({
            isChangeConfirmOpen: true
        });
    };


    _handleChangeConfirmCancelClick = () => {
        this.setState({
            isChangeConfirmOpen: false,
            title: this.props.activeEventName,
        });
    };


    _handleChangeConfirmAcceptClick = () => {
        this.setState({
            isChangeConfirmOpen: false
        });
        this.props.eventsActions.changeEventName(this.props.activeEventId, this.state.title);
    };


    render() {
        const { activeEventName } = this.props;
        const { isChangeConfirmOpen, title } = this.state;
        const isTitleUnchanged = activeEventName === title;
        const isTitleLengthOk = title.length >= MIN_TITLE_LENGTH;

        return (
            <div>
                <Form
                    as={Segment}
                >
                    <Form.Field>
                        <Header 
                            content="Titel"
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            fluid
                            placeholder="Veranstaltungstitel..."
                            value={title}
                            onChange={this._handleTitleChange}
                        />
                    </Form.Field>
                    <FormFieldAction>
                        <Button
                            content="Zurücksetzen"
                            disabled={isTitleUnchanged}
                            onClick={this._handleResetClick}
                        />
                        <Button
                            content="Speichern"
                            disabled={isTitleUnchanged || !isTitleLengthOk}
                            primary
                            onClick={this._handleSaveClick}
                        />
                    </FormFieldAction>
                </Form>
                <Confirm
                    confirmText='Titel ändern'
                    content={
                        <div>
                            <p>Willst du die Veranstaltung wirklich in "{title}" (vorher: "{activeEventName}" ) umbenennen?</p>
                        </div>
                    }
                    hasCancel
                    headerText='Veranstaltungstitel ändern'
                    isOpen={isChangeConfirmOpen}
                    onCancel={this._handleChangeConfirmCancelClick}
                    onConfirm={this._handleChangeConfirmAcceptClick}
                />
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        activeEventId: getActiveEventId(state.events),
        activeEventName: getActiveEventName(state.events),        
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        eventsActions: bindActionCreators(eventsActions, dispatch),
    };
}


const ConnectedManageEventNameForm = connect(mapStateToProps, mapDispatchToProps)(ManageEventNameForm);
export { ConnectedManageEventNameForm as ManageEventNameForm };