import React from 'react';
import {Tooltip, Button, Dropdown, Menu} from 'antd';

import { EllipsisOutlined, InfoCircleFilled ,CaretDownOutlined } from '@ant-design/icons';
import EditableTable from './editable_table'
import TooltipButton from './tooltip_button'
import HeaderPresets from './header_presets'
class ApiTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    stopClickPropagation = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    onEditableTableRef = (ref) => {
        console.log(ref);
        this.editableTableRef = ref;
    }
    
    handlePersistAllBtnClick = (dataSource) => {
        dataSource.forEach(item => {
            item.initialValue = item.currentValue
        })
        this.editableTableRef.setDataSourceState(dataSource)
    }
    
    handleResetAllBtnClick = (dataSource) => {
        dataSource.forEach(item => {
            item.currentValue = item.initialValue
        })
        this.editableTableRef.setDataSourceState(dataSource)
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
        this.editableTableRef.setDataSourceState(dataSource)
        this.stopClickPropagation(domEvent)
    }

    handleChange = (dataSource, saveFlag = true) => {
        this.props.onChange(dataSource, saveFlag);
    }

    render() {
     
        const {scene, editable = true, draggable = true, tableProps, tableClassName} = this.props;
        return (
            <EditableTable 
                rowKey='id'
                showCheckbox={false}
                tableProps={tableProps}
                draggable={draggable}
                editable={editable} 
                ref={ref => this.editableTableRef = ref}
                columns={
                    [
                        {
                            title: 'Method',
                            dataIndex: 'method',
                            // width: '33%',
                            editable: editable,
                            className: 'drag-visible',
                            // placeholder: 'Key'
                            type: 'select'
                        },
                        {
                            name: 'Request URL',
                            title: 'Request URL',
                            dataIndex: 'url',
                            // width: '33%',
                            editable: editable,
                            className: 'drag-visible',
                            placeholder: 'URL'
                        },
                        {
                            name: 'Request Body',
                            title: 'Request Body',
                            dataIndex: 'body',
                            // width: '33%',
                            editable: editable,
                            className: 'drag-visible',
                            placeholder: 'Body',
                            hide: true,
                        },
                        {
                            name: 'Description',
                            title: 'Description',
                            dataIndex: 'description',
                            // width: '33%',
                            editable: editable,
                            className: 'drag-visible',
                            placeholder: 'Description'
                        },
                        {
                            name: 'Status Code',
                            title: 'Status Code',
                            dataIndex: 'statusCode',
                            // width: '33%',
                            editable: editable,
                            className: 'drag-visible',
                            placeholder: 'Code',
                            defaultValue: 200
                        },
                        {
                            name: 'Response Body',
                            title: 'Response Body',
                            dataIndex: 'responseBody',
                            // width: '33%',
                            editable: editable,
                            className: 'drag-visible',
                            hide: true
                        }
                    ]
                }
                onChange={this.handleChange}
                tableClassName={tableClassName}
            />
        )
    }
}

export default ApiTable;







