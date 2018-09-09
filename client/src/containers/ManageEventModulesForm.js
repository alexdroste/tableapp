import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Form, Segment, Checkbox, Confirm } from 'semantic-ui-react';


class ManageEventModulesForm extends React.Component {
    /**
     */
    static get propTypes() {
        return {
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
        //const {activeEventTitle} = this.props;

        return (
            <Form
                as={Segment}
                disabled
            >
                <Form.Field>
                    <Header 
                        content="Module aktivieren/deaktivieren"
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        label="Einträge"
                        checked
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        label="Umfragen"
                        checked
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        label="Quiz"
                        checked
                    />
                </Form.Field>
                {/* TODO confirm modal */}
                <Confirm
                    open={false}
                    onCancel={this.handleCancel}
                    onConfirm={this.handleConfirm}
                />
            </Form>
        );
    }
}


const mapStateToProps = (state, props) => {
    return { 
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
    };
}


const ConnectedManageEventModulesForm = connect(mapStateToProps, mapDispatchToProps)(ManageEventModulesForm);
export { ConnectedManageEventModulesForm as ManageEventModulesForm };