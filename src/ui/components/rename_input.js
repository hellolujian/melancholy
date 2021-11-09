import React from 'react';
import {Input, Typography, Space} from 'antd';
import { EDIT_ICON } from '@/ui/constants/icons'
import RequiredInput from './required_input'
import {stopClickPropagation} from '@/utils/global_utils';
import 'ui/style/required_input.css'
import Ellipsis from 'react-ellipsis-component';
const {Text} = Typography;

class RenameInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue,
        }
    }

    componentDidMount() {
      
    }

    handleSave = (value) => {
        this.setState({editing: false});
        this.props.onSave(value)
    }

    handleChange = (value) => {
        this.props.onChange(value)
    }

    render() {
     
        const {editIconClass, editWhenHover, value, editing} = this.props;
        
        const {} = this.state;

        return (
            <>
                {            
                    editing ? (
                        <RequiredInput 
                            value={value} 
                            onSave={this.handleSave} 
                            onChange={this.handleChange}
                        />
                    ) : (
                        <Space align="center">
                            <Ellipsis text={value} />
                            {/* <span className={editIconClass} onClick={this.handleEditIconClick}>{EDIT_ICON}</span> */}
                        </Space>
                    )
                }
            
            </>
           
            
        )
    }
}

export default RenameInput;
RenameInput.defaultProps = {
    onChange: () => {},
    onSave: () => {},
}







