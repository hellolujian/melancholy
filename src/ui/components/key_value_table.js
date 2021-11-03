import React from 'react';
import {Row, Col, Button, Table, Divider, Select, Popover, Typography} from 'antd';

import EditableTable from './editable_table'
import HeaderPresets from './header_presets'
import BulkEditTextarea from './bulk_edit_textarea'
import {stopClickPropagation, UUID} from '@/utils/global_utils';
import 'ui/style/editable_table.css'

const {Option} = Select;
const {Text} = Typography
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
        let columns = [
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
            
        ];
        if (scene === 'formdata') {
            let contentTypeTip = "The Content-Type entity is used to indicate the media type of the media type of the resource. Postman will automatically assign a content-type if this field is left empty."
            columns.push(
                {
                    name: 'Content Type',
                    title: (
                        <Popover overlayStyle={{width: 300}} content={contentTypeTip} title="Content Type">
                            CONTENT TYPE
                        </Popover>
                    ),
                    dataIndex: 'contentType',
                    // width: '33%',
                    editable: editable,
                    className: 'drag-visible',
                    placeholder: 'Auto'
                }
            )
        }
        let descriptionTip = <Text>
            This is the request meta data which shows up in Postman documentation. These are <Text strong>not sent</Text> with your HTTP request
        </Text>
        columns.push({
            name: 'Description',
            title: (
                <Popover overlayStyle={{width: 300}} content={descriptionTip} title="Description">
                    DESCRIPTION
                </Popover>
            ),
            dataIndex: 'description',
            // width: '33%',
            editable: editable,
            className: 'drag-visible',
            placeholder: 'Description'
        })
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
                columns={columns} 
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






