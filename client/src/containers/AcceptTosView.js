import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as userActions from '../actions/user';
import { Button, Modal } from 'semantic-ui-react';


class AcceptTosView extends React.Component {
    static get propTypes() {
        return {
            userActions: PropTypes.object.isRequired,
        };
    };

    static get defaultProps() {
        return {};
    };


    _handleAcceptClick = (e) => {
        this.props.userActions.acceptTos();
    };


    _handleDeclineClick = (e) => {
        this.props.userActions.logout();
    };


    render() {
        return (
            <Modal
                open
            >
                <Modal.Header>
                    Nutzungsbedingungen
                </Modal.Header>
                <Modal.Content>
                    <strong>Um diese Anwendung nutzen zu können, müssen Sie den folgenden Nutzungsbedingungen zustimmen:</strong>
                    <br/><br/>
                    Sie sind damit einverstanden, dass die folgenden Daten gespeichert 
                    und zu wissenschaftlichen Zwecken weiterverarbeitet bzw. analysiert werden:
                    <ul>
                        <li>Nutzungszeiten</li>
                        <li>User-Agent</li>
                        <li>IP-Adresse</li>
                    </ul> 
                    <br/>
                    Sie sind ebenfalls damit einverstanden, dass die Anwendung 
                    Ihre <em>E-Mail</em> bzw. Ihr <em>Kürzel</em> dazu benutzt,
                    über das Nutzerverzeichnis Ihren <em>Namen</em> abzufragen und mit von 
                    Ihnen im Zuge der Nutzung der Anwendung erstellten Inhalten zu verlinken.
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        content="Ablehnen"
                        onClick={this._handleDeclineClick}
                    />
                    <Button
                        content="Annehmen"
                        icon="checkmark"
                        positive
                        onClick={this._handleAcceptClick}
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        // TODO
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    };
}


const ConnectedAcceptTosView = connect(mapStateToProps, mapDispatchToProps)(AcceptTosView);
export { ConnectedAcceptTosView as AcceptTosView };