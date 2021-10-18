import React from 'react';
import {Tooltip, Button, Dropdown, Menu} from 'antd';

import { EllipsisOutlined, InfoCircleFilled ,CaretDownOutlined } from '@ant-design/icons';
import EditableTable from './editable_table'
import TooltipButton from './tooltip_button'
import HeaderPresets from './header_presets'
import {stopClickPropagation} from '@/utils/global_utils';
class KeyValueTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    handleSave = (dataSource) => {
        this.props.onSave(dataSource);
    }

    handleChange = (dataSource) => {
        this.props.onChange(dataSource);
    }
    
    handlePersistAllBtnClick = (dataSource) => {
        dataSource.forEach(item => {
            item.initialValue = item.currentValue
        })
        this.handleChange(dataSource);
    }
    
    handleResetAllBtnClick = (dataSource) => {
        dataSource.forEach(item => {
            item.currentValue = item.initialValue
        })
        this.handleChange(dataSource);
    }

    handleCellOperationSel = ({key, selectedKeys, domEvent}, record, dataSource) => {
        let changedColumn = dataSource.find(item => item.index === record.index)
        if (!changedColumn) {
            return;
        }
        switch (key) {
            case 'persist': 
                changedColumn.initialValue = changedColumn.currentValue
                break;
            case 'reset':
                changedColumn.currentValue = changedColumn.initialValue
                break;
            default: break;
        }
        stopClickPropagation(domEvent)
        this.handleChange(dataSource);
    }

    render() {
     
        const {scene, editable = true, draggable = true, tableProps, value} = this.props;
        return (
            <EditableTable 
                rowKey='id'
                tableProps={tableProps}
                draggable={draggable}
                editable={editable} 
                columns={
                    [
                        {
                            title: 'KEY',
                            dataIndex: 'name',
                            // width: '33%',
                            editable: editable,
                            className: 'drag-visible',
                            placeholder: 'Key'
                        },
                        {
                            name: 'Value',
                            title: 'VALUE',
                            dataIndex: 'initialValue',
                            // width: '33%',
                            editable: editable,
                            className: 'drag-visible',
                            placeholder: 'Value'
                        },
                        {
                            name: 'Description',
                            title: 'DESCRIPTION',
                            dataIndex: 'currentValue',
                            // width: '33%',
                            editable: editable,
                            className: 'drag-visible',
                            placeholder: 'Description'
                        }
                    ]
                } 
                operations = {
                    (dataSource) => {
                        if (!editable) {
                            return []
                        }
                        let operations = [
                            (
                                <TooltipButton 
                                    label="Bulk Edit" 
                                    buttonProps={{
                                        type: 'link', size: 'small', 
                                        onClick: () => this.handlePersistAllBtnClick(dataSource)
                                    }}
                                />
                            )
                        ];
                        if (scene === 'headers') {
                            operations.push(<HeaderPresets />)
                        }
                        return operations;
                    }
                }
        
                dataSource={value}
                onChange={this.handleChange}
                onSave={this.handleSave}
            />
        )
    }
}

export default KeyValueTable;







