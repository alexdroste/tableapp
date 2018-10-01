import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ActiveEventQrCodeModal } from './ActiveEventQrCodeModal';
import { ActionSheet } from '../components/ActionSheet';


class MainNavActionSheet extends React.Component {
    static get propTypes() {
        return {
            onClose: PropTypes.func.isRequired,
        };
    };

    static get defaultProps() {
        return {};
    };


    constructor(props) {
        super(props);

        this.state = {
            isActiveEventQrCodeModalOpen: false,
        };

        this.actions = [
            { 
                name: 'Veranstaltung wechseln',
                icon: 'exchange',
                onClick: this._handleSwitchEventClick,
            },
            {
                name: 'QR-Code anzeigen',
                icon: 'qrcode',
                onClick: this._handleShowQRCodeClick,
            },
            {
                name: 'Einstellungen',
                icon: 'setting',
                onClick: this._handleSettingsClick,
            },
            {
                name: 'Ausloggen',
                icon: 'sign out',
            },
        ];
    }


    _handleCloseQRCodeClick = (e) => {
        this.setState({
            isActiveEventQrCodeModalOpen: false,
        });
    };


    _handleSettingsClick = (e) => {
        this.props.history.push('/settings');
        this.props.onClose(e);
    }


    _handleShowQRCodeClick = (e) => {
        this.setState({
            isActiveEventQrCodeModalOpen: true,
        });
    };


    _handleSwitchEventClick = (e) => {
        this.props.history.push('/switchevent');
        this.props.onClose(e);
    };


    render() {
        const { onClose } = this.props;
        const { isActiveEventQrCodeModalOpen } = this.state;

        return (
            <div>
                <ActionSheet
                    actions={this.actions}
                    onClose={onClose}
                />
                {isActiveEventQrCodeModalOpen && 
                    <ActiveEventQrCodeModal
                        onClose={this._handleCloseQRCodeClick}
                    />
                }
            </div>
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
        // TODO
    };
}


const ConnectedMainNavActionSheet = withRouter(connect(mapStateToProps, mapDispatchToProps)(MainNavActionSheet));
export { ConnectedMainNavActionSheet as MainNavActionSheet };