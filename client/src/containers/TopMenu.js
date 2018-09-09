import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Menu, Ref, Button } from 'semantic-ui-react';


const MenuItem = styled(Menu.Item)`
    text-align: center;
    justify-content: center;

    &&& {
        flex: 1 1 auto;
    }
`;


const MenuButton = styled(Button).attrs({
    basic: true
})`
    &&&&&&&& {
        box-shadow: none !important;
    }
`


const MenuHeight = styled.div.attrs({
    style: props => ({
        height: props.height + 'px'
    })
})`
    margin-bottom: 1em;
`;


const OffsetLeftPusher = styled.span.attrs({
    style: props => ({
        width: props.offset
    }),
})`
    transition: width .5s ease;
`;


class TopMenu extends React.Component {
    /**
     * @property {string} [activeEventTitle] title of active event (injected by redux)
     * @property {object} [offsetLeft=0] left offset in css px (for use with pushing sidebar for instance)
     * @property {function(event: object)} onMenuClick callback when menu button was clicked
     */
    static get propTypes() {
        return {
            activeEventTitle: PropTypes.string,
            offsetLeft: PropTypes.number,
            onMenuClick: PropTypes.func.isRequired,
        };
    };

    static get defaultProps() {
        return {
            offsetLeft: 0
        };
    };


    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }


    constructor(props) {
        super(props);

        this.state = {
            menuHeight: 0
        };
    }


    componentDidMount() {
        this.updateHeight();
        window.addEventListener('resize', this.updateHeight);
    }


    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeight);
    }


    updateHeight = () => {
        const newHeight = this.menuRef.clientHeight;
        if (newHeight !== this.state.menuHeight)
            this.setState({
                menuHeight: this.menuRef.clientHeight
            });
    }


    render() {
        const { activeEventTitle, offsetLeft, onMenuClick } = this.props;
        const { menuHeight } = this.state;

        return (
            <div>
                <Ref innerRef={menuRef => this.menuRef = menuRef}>
                    <Menu  
                        borderless
                        fixed="top"
                    >
                        <OffsetLeftPusher
                            offset={offsetLeft}
                        />
                        <MenuItem>
                            <MenuButton 
                                icon="bars"
                                // onClick={this.context.router.history.goBack}
                                onClick={onMenuClick}
                            />                            
                        </MenuItem>
                        <MenuItem>
                            {activeEventTitle}
                        </MenuItem>
                        <MenuItem>
                            <MenuButton 
                                icon="bell"
                                onClick={() => alert('action: open notifications')}                            
                            />    
                        </MenuItem>
                    </Menu>
                </Ref>
                <MenuHeight height={menuHeight}/>
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        activeEventTitle: state.events[state.activeEventId].name,
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
    };
}


const ConnectedTopMenu = connect(mapStateToProps, mapDispatchToProps)(TopMenu);
export { ConnectedTopMenu as TopMenu };