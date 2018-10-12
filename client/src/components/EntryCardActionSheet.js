import React from 'react';
import PropTypes from 'prop-types';
import { ActionSheet } from './ActionSheet';


export class EntryCardActionSheet extends React.PureComponent {
    static get propTypes() {
        return {
            bookmark: PropTypes.bool.isRequired,
            canManageEntry: PropTypes.bool.isRequired,
            follow: PropTypes.bool.isRequired,
            isOpen: PropTypes.bool.isRequired,
            onBookmarkToggle: PropTypes.func.isRequired,
            onClose: PropTypes.func.isRequired,
            onDeleteClick: PropTypes.func.isRequired,
            onEditClick: PropTypes.func.isRequired,
            onFollowToggle: PropTypes.func.isRequired,
        };
    };

    static get defaultProps() {
        return {};
    };


    render() {
        const { bookmark, canManageEntry, follow, isOpen, onBookmarkToggle, 
            onClose, onDeleteClick, onEditClick, onFollowToggle } = this.props;

        const actions = [
            {
                color: bookmark ? 'blue' : null,
                name: bookmark ? 'De-Markieren (Lesezeichen entfernen)' : 'Markieren (Lesezeichen)',
                icon: 'bookmark',
                onClick: onBookmarkToggle,
            },
            { 
                color: follow ? 'blue' : null,
                name: follow ? 'Benachrichtigungen deaktivieren' : 'Benachrichtigungen aktivieren',
                icon: 'bell',
                onClick: onFollowToggle,
            },
        ];
        if (canManageEntry) {
            actions.push({
                    name: 'Bearbeiten',
                    icon: 'text cursor',
                    onClick: onEditClick,
                },
                {
                    name: 'Löschen',
                    icon: 'trash',
                    onClick: onDeleteClick,
                });
        }

        return (
            <ActionSheet
                actions={actions}
                isOpen={isOpen}
                onClose={onClose}
            />
        );
    }
}
