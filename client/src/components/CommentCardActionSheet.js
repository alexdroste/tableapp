import React from 'react';
import PropTypes from 'prop-types';
import { ActionSheet } from './ActionSheet';


export class CommentCardActionSheet extends React.PureComponent {
    static get propTypes() {
        return {
            canManageComment: PropTypes.bool.isRequired,
            isDeleted: PropTypes.bool.isRequired,
            isOpen: PropTypes.bool.isRequired,
            onClose: PropTypes.func.isRequired,
            onDeleteClick: PropTypes.func.isRequired,
        };
    };

    static get defaultProps() {
        return {};
    };


    render() {
        const { canManageComment, isDeleted, isOpen, onClose, onDeleteClick } = this.props;

        const actions = [];
        if (canManageComment && !isDeleted) {
            actions.push(
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
