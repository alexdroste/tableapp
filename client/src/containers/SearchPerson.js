import React from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { Search } from 'semantic-ui-react';
import { getUserDict } from '../reducers/eventInfo';


class SearchPerson extends React.Component {
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
            isLoading: false,
            results: [],
            value: '',
        };
    }


    _handleResultSelect = (e, { result }) => {
        this.setState({
            value: result.title,
        });
    };


    _handleSearchChange = (e, { value }) => {
        this.setState({ 
            isLoading: true,
            value,
        });
        this._performSearch(value);
    };


    _performSearch = debounce((value) => {
        let results = [];
        if (value) {
            const {userDict} = this.props;
            results = Object.keys(userDict).reduce((acc, cur) => {
                const curUser = userDict[cur];
                if (curUser.name.indexOf(value) !== -1 || curUser.email.indexOf(value) !== -1)
                    acc.push({
                        title: curUser.name,
                        description: curUser.email,
                    });
                return acc;
            }, []);
        }

        this.setState({
            isLoading: false,
            results,
        });
    }, 300);


    render() {
        const {className} = this.props;
        const {isLoading, results, value} = this.state;

        return (
            <Search
                className={className}
                loading={isLoading}
                onResultSelect={this._handleResultSelect}
                onSearchChange={this._handleSearchChange}
                results={results}
                value={value}
                placeholder="Person suchen..."
                fluid
            />
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        userDict: getUserDict(state.eventInfo),
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
    };
}


const ConnectedSearchPerson = connect(mapStateToProps, mapDispatchToProps)(SearchPerson);
export { ConnectedSearchPerson as SearchPerson };