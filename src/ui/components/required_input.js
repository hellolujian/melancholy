import React from 'react';
import {Input, Button, Space} from 'antd';
import { EDIT_ICON } from '@/ui/constants/icons'
import {stopClickPropagation} from '@/utils/global_utils';
import 'ui/style/required_input.css'

class RequiredInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inputValue: props.defaultValue,
            editing: props.editing,
        }
    }

    componentWillReceiveProps (nextProps) {
        const { editing: newEditingValue } = nextProps;
        const { lastPropsEditing } = this.state;
        if (lastPropsEditing !== newEditingValue) {
            this.setState({editing: newEditingValue, lastPropsVisible: newEditingValue})
        } 
    }

    componentDidMount() {
      
    }

    handleInputChange = (e) => {
        this.setState({inputValue: e.target.value, showRed: true});
        this.props.onChange(e);
    }

    handleEditIconClick = (e) => {
        this.setState({editing: true});
        stopClickPropagation(e)
    }

    saveCollectionName = () => {
        this.setState({editing: false});
    }

    handleInputClick = (e) => {
        stopClickPropagation(e);
    }
    render() {
     
        const {title, color = 'gray', label, type, editable = {}, editIcon = {}, editWhenHover} = this.props;
        
        let inputProps = {...this.props};
        delete inputProps.divProps;
        delete inputProps.onChange;
        delete inputProps.editIcon;
        const {inputValue, editing, showRed} = this.state;
        let borderColor = !(inputValue && inputValue.trim()) && showRed ? 'red' : 'gray';
        return (
            <>
            
                {            
                    editing ? (
                        <div style={{border: '1px solid ' + borderColor, display: 'inline-block'}}>
                            <Input
                            
                                size="small"
                                bordered={false}
                                onChange={this.handleInputChange}
                                autoFocus
                                value={inputValue}
                                style={{padding: 0}}
                                onBlur={this.saveCollectionName}
                                onPressEnter={this.saveCollectionName}
                                onClick={this.handleInputClick}
                                {...inputProps}
                            />
                            
                        </div>
                    ) : (
                        <Space className={editWhenHover ? "not-edit-container" : ""}>
                            <span className={editWhenHover ? "not-editing-text" : ""} style={{border: '1px solid rgb(0,0,0,0)', display: 'inline-block'}}>{inputValue}</span>
                            {editIcon && (<span className={'not-editing-edit-icon ' + (editIcon.className ? editIcon.className : "")} onClick={this.handleEditIconClick}>{EDIT_ICON}</span>)}
                        </Space>
                    )
                }
            
            </>
           
            
        )
    }
}

export default RequiredInput;
RequiredInput.defaultProps = {
    onChange: () => {},
}







