import React from 'react';
import {Input, Typography, Space} from 'antd';

import {getCurrentTheme, getEditIcon} from '@/utils/style_utils'
import RequiredInput from './required_input'
import {stopClickPropagation} from '@/utils/global_utils';
import 'ui/style/required_input.css'
import Ellipsis from 'react-ellipsis-component';
const {Text} = Typography;

class EditableText extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue,
            editing: props.editing,
        }
    }

    componentDidMount() {
      
    }

    handleEditIconClick = (e) => {
        this.setState({editing: true});
        stopClickPropagation(e)
    }

    handleSave = (value) => {
        this.setState({editing: false});
        if (value && value.trim()) {
            this.props.onSave(value)
        }
    }

    handleChange = (value) => {
        this.setState({value: value});
        this.props.onChange(value)
    }

    render() {
     
        const {editIconClass, editWhenHover} = this.props;
        
        const {editing, value} = this.state;
        let realValue = this.props.hasOwnProperty('value') ? this.props.value : value;

        return (
            <>
                {            
                    editing ? (
                        <RequiredInput 
                            value={realValue} 
                            onSave={this.handleSave} 
                            onChange={this.handleChange}
                        />
                    ) : (
                        // <Space className={editWhenHover ? "not-edit-container" : ""} >
                        //     <span className={editWhenHover ? "not-editing-text" : ""} style={{border: '1px solid rgb(0,0,0,1)', display: 'inline-block'}}>
                        //         {value}
                        //     </span>
                        //     <span className={'not-editing-edit-icon ' + (editIcon.className ? editIcon.className : "")} onClick={this.handleEditIconClick}>{EDIT_ICON}</span>
                        // </Space>
                        <Space align="center" className="editable-text-container">
                            <Ellipsis text={realValue} />
                            <span className={`ecitable-icon-class ${editIconClass}`} onClick={this.handleEditIconClick}>{getEditIcon()}</span>
                        </Space>
                    )
                }
            
            </>
           
            
        )
    }
}

export default EditableText;
EditableText.defaultProps = {
    onChange: () => {},
    onSave: () => {},
}







