import React from 'react';
import {Tooltip, Button, Typography, Dropdown, Menu} from 'antd';

const {Link} = Typography;
class DropdownTooltip extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    componentDidMount() {
      
    }

    handleBtnClick = (e) => {
        const { buttonProps = {}, onClick} = this.props;
        let customClick = buttonProps.onClick || onClick;
        if (customClick) {
            customClick(e);
        }
        this.setState({visible: false});
    }


    handleMouseLeave = (e) => {
        this.setState({visible: false});
    }

    handleMouseEnter = (e) => {
        this.setState({visible: true});
    }

    render() {
     
        const {label, type = 'primary', buttonProps = {}, tooltipProps = {}, title, icon, shape, size, trigger, dropdownProps, overlay} = this.props;
      
        const {visible} = this.state;
        return (

            <Dropdown 
                trigger={trigger}
                overlay={overlay}
                {...dropdownProps}>
                <Tooltip visible={visible} color='gray' title={title} {...tooltipProps}>
                    {
                        <Button type={type} icon={icon} shape={shape} size={size} onClick={this.handleBtnClick} {...buttonProps} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                            {label ? label : ""}
                        </Button>
                    }
                </Tooltip>
                
            </Dropdown>
            
        )
    }
}

export default DropdownTooltip;







