import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Button, Form, Segment, Input } from 'semantic-ui-react';
import { FormFieldAction } from '../components/FormFieldAction';
import { getActiveEventName } from '../reducers/events'; 


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
            
        };
    }


    render() {
        const {activeEventName} = this.props;

        return (
            <Form
                as={Segment}
                disabled
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
                        value={activeEventName}
                    />
                </Form.Field>
                <FormFieldAction>
                    <Button
                        content="Zurücksetzen"
                    />
                    <Button
                        content="Speichern"
                        primary
                    />
                </FormFieldAction>
            </Form>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        activeEventName: getActiveEventName(state.events),        
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
    };
}


const ConnectedManageEventNameForm = connect(mapStateToProps, mapDispatchToProps)(ManageEventNameForm);
export { ConnectedManageEventNameForm as ManageEventNameForm };