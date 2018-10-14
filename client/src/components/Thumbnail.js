import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Image, Icon } from 'semantic-ui-react';


const InnerImage = styled.img`
    margin: 0;
    padding: 0;
`;


const Thumb = styled(Image)`
    cursor: pointer;
    ${props => !props['data-hasinnerimage'] && (props['data-ishuge'] ? `
        width: 258px; /* 256px + 2px border */
        height: 258px; 
    ` : `
        width: 82px; /* 80px + 2px border */
        height: 82px; 
    `)}
    border: 1px ${props => props['data-hasdashedborder'] ? 'dashed' : 'solid'} rgba(0,0,0,.2);
    border-radius: .28571429rem;
    overflow: hidden;
`;


const MainIcon = styled(Icon)`
    &&& {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
        font-size: 20px;
    }
`;


const SelectionIcon = styled(Icon).attrs({
    circular: true,
    inverted: true,
    name: 'check',
})`
    &&& {
        position: absolute;
        bottom: 4px;
        right: 4px;
        margin: 0;
        font-size: 14px;
    }
`;


// TODO
export class Thumbnail extends React.Component {
    static get propTypes() {
        return {
            alt: PropTypes.string,
            hasDashedBorder: PropTypes.bool,
            icon: PropTypes.string,
            isHuge: PropTypes.bool,
            isSelectable: PropTypes.bool,
            isSelected: PropTypes.bool,
            onClick: PropTypes.func.isRequired,
            src: PropTypes.string,
        };
    };

    static get defaultProps() {
        return {
            hasDashedBorder: false,
            isHuge: false,
            isSelectable: false,
            isSelected: false,
        };
    };


    render() {
        const { alt, hasDashedBorder, icon, isHuge, isSelectable, isSelected, onClick, src } = this.props;

        const width = isHuge ? 256 : 80;

        return (
            <Thumb
                onClick={onClick}
                data-ishuge={isHuge}
                data-hasinnerimage={!!src}
                data-hasdashedborder={hasDashedBorder}
            >
                {src &&
                    <InnerImage 
                        src={src} 
                        alt={alt}
                        width={width}
                    />
                }
                {icon &&
                    <MainIcon 
                        name={icon} 
                        color="grey"
                    />
                }
                {isSelectable && 
                    <SelectionIcon
                        disabled={!isSelected}
                        color={isSelected ? "blue" : "grey"}
                    />
                }
            </Thumb>
        );
    }
}
