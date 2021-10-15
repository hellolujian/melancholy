import React from 'react';
import {Tooltip, Button, Dropdown, Menu} from 'antd';

import { EllipsisOutlined, InfoCircleFilled ,CaretDownOutlined } from '@ant-design/icons';
import EditableTable from './editable_table'
import TooltipButton from './tooltip_button'
import HeaderPresets from './header_presets'
class KeyValueTable extends React.Component {

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

    render() {
     
        const {scene, editable = true, draggable = true, tableProps, dataSource} = this.props;
        return (
            <EditableTable 
                rowKey='index'
                tableProps={tableProps}
                draggable={draggable}
                editable={editable} 
                ref={ref => this.editableTableRef = ref}
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
                                buttonProps={{type: 'link', size: 'small', onClick: () => this.handlePersistAllBtnClick(dataSource)}}
                            />
                        )
                    ];
                    if (scene === 'headers') {
                        operations.push(<HeaderPresets />)
                    }
                    return operations;
                }
            }
       
            dataSource={dataSource}
            // tableProps = {{
            //     title: () => 'Query Params'
            // }}
            />
        )
    }
}

export default KeyValueTable;







