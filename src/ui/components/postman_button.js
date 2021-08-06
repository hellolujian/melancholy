import React from 'react';
import {Tooltip, Button, Typography} from 'antd';

const {Link} = Typography;
class PostmanButton extends React.Component {

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
        return (
            <Button type="text" className="postman-button-class" {...this.props}>
                {this.props.children}
            </Button>
        )
    }
}

export default PostmanButton;







