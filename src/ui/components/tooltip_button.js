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
     
        const {title, color = 'gray', label, type} = this.props
        let buttonProps = {...this.props};
        delete buttonProps.title;
        delete buttonProps.color;
        return (
            <Tooltip title={title} color={color}>
                {
                    type === 'purelink' ? (
                        <a style={{display: 'inline-block'}} className="ant-dropdown-link" {...buttonProps}>
                            {label ? label : ""}
                        </a>
                    ) : (
                        <Button type="primary" {...buttonProps}>
                            {label ? label : ""}
                        </Button>
                    )
                }
            </Tooltip>
        )
    }
}

export default TooltipButton;







