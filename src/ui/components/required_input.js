import React from 'react';
import {Input, Typography, Space} from 'antd';
import { EDIT_ICON } from '@/ui/constants/icons'
import {stopClickPropagation} from '@/utils/global_utils';
import 'ui/style/required_input.css'
const {Text} = Typography;

class RequiredInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue,
        }
    }

    componentDidMount() {
      
    }

    handleInputChange = (e) => {
        this.setState({value: e.target.value, showRed: true});
        this.props.onChange(e);
    }

    handleSave = (e) => {
        let value = e.target.value;
        if (value && value.trim()) {
            this.setState({value: value.trim()});
            this.props.onSave(value.trim())
        }
    }

    handleInputClick = (e) => {
        stopClickPropagation(e);
    }

    render() {
     
        const {defaultValue} = this.props;
        
        const {value, showRed} = this.state;
        let inputValue = this.props.hasOwnProperty('value') ? this.props.value : value;
        let borderColor = !(inputValue && inputValue.trim()) && showRed ? 'red' : 'gray';
        return (
            <div style={{border: '1px solid ' + borderColor, display: 'inline-block'}} className="full-width">
                <Input
                    autoFocus
                    size="small"
                    bordered={false}
                    value={inputValue}
                    defaultValue={defaultValue}
                    onChange={this.handleInputChange}
                    style={{padding: 0, width: '100%'}}
                    onBlur={this.handleSave}
                    onPressEnter={this.handleSave}
                    onClick={this.handleInputClick}
                />
            </div>
        )
    }
}

export default RequiredInput;
RequiredInput.defaultProps = {
    onChange: () => {},
    onSave: () => {},
}







