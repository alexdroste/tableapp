import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as entriesActions from '../actions/entries';
import { getIdList, getListType, hasMoreEntriesToLoad, isListSubscribed, EntryListTypeEnum, hasListOnlyBookmarked } from '../reducers/entries';
import { Header, Dropdown, Message, Button, Responsive } from 'semantic-ui-react';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import { EntryCardContainer } from './EntryCardContainer';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { UserPostForm } from './UserPostForm';
import { NavBar } from './NavBar';
import { DynamicRow } from './DynamicRow';
import 'react-virtualized/styles.css';


const HeaderActionButton = styled(Button).attrs({
    basic: true,
})`
    position: absolute;
    right: 0;
    top: 2px;

    &&&&& {
        box-shadow: none!important;
        margin: 0;
        padding: 0;
        height: 100%;
    }
`;


const CustomHeader = styled(Header)`
    position: relative;
`;


const CustomList = styled(List)`
    outline: none;
`;


class EntriesView extends React.Component {
    static get propTypes() {
        return {};
    };

    static get defaultProps() {
        return {};
    };


    constructor(props) {
        super(props);

        this.props.dynamicRowsCache.onHeightChanged(this._handleRowHeightChanged);
        this.props.dynamicRowsCache.setIdOrder(props.idList);

        this._listRef = null;
        this._userPostFormRef = React.createRef();
    }


    UNSAFE_componentWillMount() {
        if (!this.props.isListSubscribed)
            this.props.entriesActions.subscribeEntryList(
                EntryListTypeEnum.RECENT, this.props.hasListOnlyBookmarked);
    }


    componentDidMount() {
        window.addEventListener('ScrollMemoryRestoreScroll', this._handleScrollMemoryRestoreScroll);
        this._resize(0);
    }


    componentWillUnmount() {
        window.removeEventListener('ScrollMemoryRestoreScroll', this._handleScrollMemoryRestoreScroll);
    }


    UNSAFE_componentWillUpdate(nextProps) {
        this.props.dynamicRowsCache.setIdOrder(nextProps.idList);
    }


    componentDidUpdate(prevProps) {
        // trigger row-load when bookmarked filter state changed 
        // and no items are loaded (stopIndex = 0)
        if (prevProps.hasListOnlyBookmarked !== this.props.hasListOnlyBookmarked) {
            this._checkLoadMoreRows(0);
        }
        if (prevProps.idList !== this.props.idList) {
            this._resize(0);
        }
    }


    _handleFloatingActionButtonClick = () => {
        if (!this._userPostFormRef.current)
            return;
        this._userPostFormRef.current.getWrappedInstance().focusTextArea();
    };


    _handleListOnlyBookmarkedClick = (e) => {
        this.props.entriesActions.subscribeEntryList(
            EntryListTypeEnum.RECENT, !this.props.hasListOnlyBookmarked);
    };


    _handleScrollMemoryRestoreScroll = (e) => {
        // e.detail == scrollY (page position to restore)
        // recalc scrollbars, FIXME scrollY isnt really correct: scrollY - offsetY of WindowScroller
        this._listRef.scrollToPosition(e.detail);
    };


    _handleRowHeightChanged = (index, id, diff) => {
        // console.log('row height changed', index, id, diff);
        if (index === -1)
            return this._resize(0);
        const scrollDiff = () => {
            // console.log('scrolldiff', index, this.curStartIndex, diff);
            if (index >= this.curStartIndex)
                return;
            // console.log('scroll by', diff);
            window.scroll({ top: window.scrollY + diff, behavior: "instant" });
        };
        if (diff < 0) {
            scrollDiff();
            this._resize(index);
        } else {
            this._resize(index);
            scrollDiff();
        }
    };

    
    _handleRowsRendered = ({ startIndex, stopIndex }) => {
        // console.log('rows rendered');
        this.curStartIndex = startIndex;
        this._checkLoadMoreRows(stopIndex);
    };


    _checkLoadMoreRows = debounce((stopIndex) => {
        // console.log('check load', stopIndex, this.props.idList.length);
        if (stopIndex >= this.props.idList.length)
            this._loadMoreRows();
    }, 500);


    _loadMoreRows = throttle(() => {
        // console.log('load called');
        this.props.entriesActions.loadMoreEntries();
    }, 3000);


    _resize = (index) => {
        if (this._listRef && index >= 0) {
            // console.log('perform resize', index);
            this._listRef.recomputeRowHeights(index);
        }
    };


    _noRowsRenderer = () => {
        return (
            <Message>
                <Message.Header>Keine Einträge</Message.Header>
            </Message>
        );
    };


    _rowRenderer = ({ index, key, style }) => {
        const entryId = this.props.idList[index];
        return (
            <DynamicRow
                cache={this.props.dynamicRowsCache}
                id={entryId}
                key={key}
                style={style}                
            >
                <EntryCardContainer
                    entryId={entryId}
                />
            </DynamicRow>
        );
    };


    render() {
        const { dynamicRowsCache, idList, hasListOnlyBookmarked, 
            hasMoreEntriesToLoad } = this.props;
        let rowCount = idList.length;
        if (hasMoreEntriesToLoad)
            ++rowCount;

        return (
            <div>
                {/*remove the responsive element here => navbar does not render railcontent when mobile*/}
                <NavBar
                    rightRailContent={
                        <Responsive
                            minWidth={801}
                        >
                            <Button
                                color="blue"
                                circular
                                icon="add"
                                size="big"
                                onClick={this._handleFloatingActionButtonClick}
                            />
                        </Responsive>
                    }
                />
                <Responsive
                    maxWidth={800}
                >
                    <FloatingActionButton
                        icon="add"
                        onClick={this._handleFloatingActionButtonClick}
                    />
                </Responsive>
                <UserPostForm
                    ref={this._userPostFormRef}
                />
                <CustomHeader>
                    <Header.Content>
                        Einträge
                        <HeaderActionButton
                            color={hasListOnlyBookmarked ? "blue" : undefined}
                            content={hasListOnlyBookmarked ? "Nur Markierte" : "Markierte filtern"}
                            icon="bookmark"
                            onClick={this._handleListOnlyBookmarkedClick}
                        />
                    </Header.Content>
                    {/* <Header.Subheader>
                        <Dropdown text="Neueste">
                        <Dropdown.Menu>
                            <Dropdown.Item text='Neueste' />
                            <Dropdown.Item text='Topaktuell' />
                            <Dropdown.Item text='Bestbewertet' />
                        </Dropdown.Menu>
                        </Dropdown>
                    </Header.Subheader> */}
                </CustomHeader>
                <WindowScroller>
                    {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
                        <AutoSizer disableHeight>
                            {({ width }) => (
                                <div ref={registerChild}>
                                    <CustomList
                                        autoHeight
                                        height={height}
                                        isScrolling={isScrolling}
                                        noRowsRenderer={this._noRowsRenderer}
                                        onRowsRendered={this._handleRowsRendered}
                                        onScroll={onChildScroll}
                                        overscanRowCount={2}
                                        innerRef={ref => this._listRef = ref}
                                        rowCount={rowCount}
                                        rowHeight={dynamicRowsCache.getHeightByIndexObj}
                                        rowRenderer={this._rowRenderer}
                                        scrollTop={scrollTop}
                                        width={width}
                                    />
                                </div>
                            )}
                        </AutoSizer>
                    )}
                </WindowScroller>
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        idList: getIdList(state.entries),
        isListSubscribed: isListSubscribed(state.entries),
        hasListOnlyBookmarked: hasListOnlyBookmarked(state.entries),
        hasMoreEntriesToLoad: hasMoreEntriesToLoad(state.entries),
        listType: getListType(state.entries),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        entriesActions: bindActionCreators(entriesActions, dispatch),
    };
}


const ConnectedEntriesView = connect(mapStateToProps, mapDispatchToProps)(EntriesView);
export { ConnectedEntriesView as EntriesView };
