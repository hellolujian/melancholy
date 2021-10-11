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
        this.setState({value: e.target.value, showRed: true});
        this.props.onValueChange(e);
    }

    handleEditIconClick = (e) => {
        this.setState({editing: true});
        stopClickPropagation(e)
    }

    handleSave = (e) => {
        let value = e.target.value;
        if (value && value.trim()) {
            this.setState({editing: false});
            this.props.onSave(value)
        }
    }

    handleInputClick = (e) => {
        stopClickPropagation(e);
    }

    render() {
     
        const {editIcon = {}, editWhenHover, defaultValue} = this.props;
        
        const {value, editing, showRed} = this.state;
        let inputValue = this.props.hasOwnProperty('value') ? this.props.value : value;
        let borderColor = !(inputValue && inputValue.trim()) && showRed ? 'red' : 'gray';
        return (
            <>
                {            
                    editing ? (
                        <div style={{border: '1px solid ' + borderColor, display: 'inline-block'}} className="full-width">
                            <Input
                                size="small"
                                bordered={false}
                                onChange={this.handleInputChange}
                                autoFocus
                                defaultValue={defaultValue}
                                value={inputValue}
                                style={{padding: 0, width: '100%'}}
                                onBlur={this.handleSave}
                                onPressEnter={this.handleSave}
                                onClick={this.handleInputClick}
                            />
                            
                        </div>
                    ) : (
                        <Space className={editWhenHover ? "not-edit-container" : ""}>
                            <span className={editWhenHover ? "not-editing-text" : ""} style={{border: '1px solid rgb(0,0,0,0)', display: 'inline-block'}}>
                                <Text style={{maxWidth: 300,}} ellipsis={{rows: 1}}>{inputValue}</Text>
                            </span>
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
    onValueChange: () => {},
    onSave: () => {},
}







