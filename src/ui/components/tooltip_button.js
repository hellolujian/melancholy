import React from 'react';
import {Tooltip, Button} from 'antd';

class TooltipButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    render() {
     
        const {label, type, buttonProps = {}, tooltipProps = {}, title, icon, shape, size, onClick} = this.props;
      
        return (
            <Tooltip color='gray' title={title} {...tooltipProps}>
                {
                    type === 'purelink' ? (
                        <a style={{display: 'inline-block'}} {...buttonProps}>
                            {label ? label : ""}
                        </a>
                    ) : (
                        <Button type="primary" icon={icon} shape={shape} size={size} onClick={onClick} {...buttonProps}>
                            {label ? label : ""}
                        </Button>
                    )
                }
            </Tooltip>
        )
    }
}

export default TooltipButton;







