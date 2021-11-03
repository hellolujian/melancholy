import React from 'react';
import {Row, Col, Button, Table, Divider, Select} from 'antd';

import EditableTable from './editable_table'
import HeaderPresets from './header_presets'
import BulkEditTextarea from './bulk_edit_textarea'
import {stopClickPropagation, UUID} from '@/utils/global_utils';
import 'ui/style/editable_table.css'

const {Option} = Select;
class KeyValueTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleSave = (dataSource) => {
        this.props.onSave(dataSource);
    }

    handleChange = (dataSource, saveFlag = true) => {
        this.props.onChange(dataSource, saveFlag);
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

    handleBulkEditClick = (keyValueEditFlag = true) => {
        this.setState({keyValueEdit: keyValueEditFlag});
    }

    handleBulkTextareaBlur = (dataSource) => {
        this.handleChange(dataSource)
    }

    handleHeadPresetItemClick = (keyValuePreset = []) => {
        let alreadyData = this.props.value || [];
        let addedData = keyValuePreset.map(item => {
            return {
                ...item,
                id: UUID()
            }
        })
        this.handleChange([...alreadyData, ...addedData])
    }

    handleKeyTypeChange = (value, record = {}) => {
        let alreadyData = this.props.value || [];
        let newData = [...alreadyData,];
        if (record.id) {
            let target = newData.find(item => item.id === record.id);
            if (target) {
                target.type = value;
            }
        } else if (value === 'file') {
            newData.push({
                id: UUID(),
                type: value, 
                src: []
            })
        }
        this.handleChange(newData);
    }

    render() {
     
        const {scene, editable = true, draggable = true, tableProps, value} = this.props;
        const {keyValueEdit} = this.state;
        return keyValueEdit ? (
            <>
                <Table
                    bordered
                    size="small"
                    className="key-value-edit-table"
                    pagination={false}
                    columns={[
                        {
                            title: (
                                <Row className="justify-content-space-between vertical-center" style={{paddingRight: 10}}>
                                    <Col />
                                    <Col>
                                        <Divider type="vertical" />
                                        <Button 
                                            type='link' 
                                            size='small'
                                            onClick={() => this.handleBulkEditClick(false)}>
                                            Key-Value Edit
                                        </Button>
                                    </Col>
                                </Row>
                            )
                        }
                    ]}
                    {...tableProps}
                />
                <BulkEditTextarea 
                    defaultValue={value}
                    onBlur={(dataSource) => this.handleChange(dataSource, true)}
                />
            </>
            
        ) : (
            <EditableTable 
                rowKey='id'
                scene={scene}
                tableProps={tableProps}
                draggable={draggable}
                editable={editable} 
                columns={
                    [
                        {
                            title: 'KEY',
                            dataIndex: 'key',
                            // width: '33%',
                            editable: editable,
                            className: 'drag-visible',
                            placeholder: 'Key'
                        },
                        {
                            name: 'Value',
                            title: 'VALUE',
                            dataIndex: 'value',
                            // width: '33%',
                            editable: editable,
                            className: 'drag-visible',
                            placeholder: 'Value'
                        },
                        {
                            name: 'Description',
                            title: 'DESCRIPTION',
                            dataIndex: 'description',
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
                                <Button 
                                    type='link' 
                                    size='small'
                                    onClick={this.handleBulkEditClick}>
                                    Bulk Edit
                                </Button>
                            )
                        ];
                        if (scene === 'headers') {
                            operations.push(
                                <HeaderPresets onItemClick={this.handleHeadPresetItemClick} />
                            )
                        }
                        return operations;
                    }
                }
                cellOperations={(record, realDataSource, col) => {
                    return col.dataIndex === 'key' && scene === 'formdata' && (
                        <Select 
                            value={record.type}
                            className="request-body-formdata-table-select" 
                            defaultValue="text" 
                            size="small" 
                            bordered={false} 
                            onChange={(value) => this.handleKeyTypeChange(value, record)}
                            onClick={stopClickPropagation}>
                            <Option value="text">Text</Option>
                            <Option value="file">File</Option>
                        </Select>
                    )
                }} 
                dataSource={value}
                onChange={this.handleChange}
                onSave={this.handleSave}
            />
            
        )
    }
}

export default KeyValueTable;

KeyValueTable.defaultProps = {
    onSave: () => {},
}






