import React from 'react';
import PropTypes from 'prop-types';
import { ActionSheet } from './ActionSheet';


export class EntryCardActionSheet extends React.PureComponent {
    static get propTypes() {
        return {
            canManageEntry: PropTypes.bool.isRequired,
            isBookmarked: PropTypes.bool.isRequired,
            isDeleted: PropTypes.bool.isRequired,
            isFollowing: PropTypes.bool.isRequired,
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
        const { canManageEntry, isBookmarked, isDeleted, isFollowing, isOpen, 
            onBookmarkToggle, onClose, onDeleteClick, onEditClick, onFollowToggle } = this.props;

        const actions = [
            {
                color: isBookmarked ? 'blue' : null,
                name: isBookmarked ? 'De-Markieren (Lesezeichen entfernen)' : 'Markieren (Lesezeichen)',
                icon: 'bookmark',
                onClick: onBookmarkToggle,
            },
            // todo
            // { 
            //     color: isFollowing ? 'blue' : null,
            //     name: isFollowing ? 'Benachrichtigungen deaktivieren' : 'Benachrichtigungen aktivieren',
            //     icon: 'bell',
            //     onClick: onFollowToggle,
            // },
        ];
        if (canManageEntry && !isDeleted) {
            actions.push(
                // TODO
                // {
                //     name: 'Bearbeiten',
                //     icon: 'text cursor',
                //     onClick: onEditClick,
                // },
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
