import React from 'react';
import PropTypes from 'prop-types';


export class TimeStamp extends React.PureComponent {
    /**
     * @property {string} [className] className
     * @property {number} timestamp timestamp (unix-timestamp)
     */
    static get propTypes() {
        return {
            className: PropTypes.string,
            timestamp: PropTypes.number.isRequired,
        };
    };
    
    static get defaultProps() {
        return {};
    };
    

    /**
     * Creates text from difference between now and provided timestamp
     * @param {number} timestamp timestamp (unix-timestamp)
     * @returns {string} time difference as text
     */
    static getTimeText(timestamp) {
        const diff = (Date.now() - timestamp) / (1000 * 60); // diff in minutes

        if (diff < 5) { // show now if diff < 5 minutes
            return "Gerade eben";
        } else if (diff < 60) { // show minutes if diff < 1 hour
            return "Vor " + Math.round(diff) + " Minuten";
        } else if (diff < 60 * 24) { // show hours if diff < 1 day
            const hours = Math.round(diff / 60);
            return `Vor ${hours} ${hours > 1 ? "Stunden" : "Stunde"}`;
        } else if (diff < 60 * 24 * 7) { // show days if diff < 7 days
            const days = Math.round(diff / (60 * 24));
            return `Vor ${days} ${days > 1 ? "Tagen" : "Tag"}`;
        } else { // else: show date
            return (new Date(timestamp)).toLocaleDateString('de-DE');
        }
    }


    constructor(props) {
        super(props);
        this.state = {
            /** Holds text to display */
            text: TimeStamp.getTimeText(this.props.timestamp)
        };
    }


    componentDidMount() {
        this.intervalId = setInterval(
            () => this.updateText(),
            // TODO clever timing (maybe)
            1000 * 60 // 1 min 
        );
    }


    componentWillUnmount() {
        clearInterval(this.intervalId);
    }


    updateText = () => {
        const oldText = this.state.text;
        const newText = TimeStamp.getTimeText(this.props.timestamp);
        if (oldText !== newText)
            this.setState({
                text: newText
            });
    };

    render() {
        return (
            <span className={this.props.className}>
                {this.state.text}
            </span>
        );
    }
}