import React from 'react';
import {Input} from 'antd';

import {UUID} from '@/utils/global_utils'
import 'ui/style/editable_table.css'

const {TextArea} = Input;

class BulkEditTextarea extends React.Component {

    getDefaultValue = () => this.props.defaultValue ? this.props.defaultValue.map(item => `${item.disabled ? '//' : ''}${item.key || ''}:${item.value || ''}`).join("\n") : ''

    constructor(props) {
        super(props);
        this.state = {
            value: this.getDefaultValue(),
        }
    }

    handleBulkTextChange = (e) => {
        this.setState({value: e.target.value});
    }

    handleBulkTextareaBlur = (e) => {
        let targetValue = e.target.value;
        if (targetValue === this.getDefaultValue()) {
            return;
        }
        const {defaultValue} = this.props;
        let newValue = targetValue.split('\n').filter(item => item.trim()).map((row, index) => {
            let keyValueObj = defaultValue.length > index ? {...defaultValue[index]} : {id: UUID()};
            let rowStr = row.trim();
            if (rowStr.indexOf("//") >= 0) {
                rowStr = rowStr.slice(2).trim();
                keyValueObj.disabled = true;
            } else {
                keyValueObj.disabled = false
            }

            let keyValueArr = rowStr.split(":");
            keyValueObj.key = keyValueArr[0];
            keyValueObj.value = keyValueArr.length === 2 ? keyValueArr[1] : '';
            return keyValueObj;
        })
        this.props.onBlur(newValue);
    }

    render() {
     
        const {value} = this.state;
        return (
            <TextArea 
                rows={7} 
                value={value}
                autoFocus
                onChange={this.handleBulkTextChange}
                onBlur={this.handleBulkTextareaBlur}
                className="key-value-edit-textarea"
                placeholder='Rows are separated new lines &#13;&#10;Keys and values are separated by : &#13;&#10;Prepend // to any row you want to add but keep disabled'
            />
        )
    }
}

export default BulkEditTextarea;







