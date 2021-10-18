import React from 'react';
import {Tooltip, Button, Dropdown, Menu} from 'antd';

import { EllipsisOutlined, InfoCircleFilled ,CloseOutlined } from '@ant-design/icons';
import EditableTable from './editable_table'
import TooltipButton from './tooltip_button'
import {INITIAL_VALUE_TIPS, CURRENT_VALUE_TIPS, PERSIST_ALL_TIPS, RESET_ALL_TIPS} from 'ui/constants/tips'
import {CIRCLE_INFO_ICON} from 'ui/constants/icons';
import {stopClickPropagation} from '@/utils/global_utils';

class VariablesTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    handleVariableChange = (dataSource) => {
        this.props.onChange(dataSource);
    }
    
    handlePersistAllBtnClick = (dataSource) => {
        dataSource.forEach(item => {
            item.initialValue = item.currentValue
        })
        this.handleVariableChange(dataSource)
    }
    
    handleResetAllBtnClick = (dataSource) => {
        dataSource.forEach(item => {
            item.currentValue = item.initialValue
        })
        this.handleVariableChange(dataSource)
    }

    handleCellOperationSel = ({key, selectedKeys, domEvent}, record, dataSource) => {
        let changedColumn = dataSource.find(item => item.id === record.id)
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
        this.handleVariableChange(dataSource)
    }

    handleCellBlur = (record, dataIndex) => {
        if (dataIndex === 'initialValue' && !record.hasOwnProperty('currentValue')) {
            record.currentValue = record.initialValue;
        }
        return record;
    }

    render() {

        const {value} = this.props;
        return (
            <EditableTable 
                rowKey='id'
                columns={[
                    {
                        title: 'VARIABLE',
                        dataIndex: 'name',
                        // width: '22%',
                        editable: true,
                        className: 'drag-visible',
                        placeholder: 'Add a new variable'
                    },
                    {
                        name: 'Initial Value',
                        title: (
                            <>
                                INITIAL VALUE 
                                <TooltipButton 
                                    type="text" 
                                    size="small"
                                    icon={CIRCLE_INFO_ICON} 
                                    title={INITIAL_VALUE_TIPS}
                                />
                            </>
                        ),
                        dataIndex: 'initialValue',
                        // width: '20%',
                        editable: true,
                        className: 'drag-visible',
                    },
                    {
                        name: 'Current Value',
                        title: (
                            <>
                                CURRENT VALUE
                                <TooltipButton 
                                    type="text" 
                                    size="small"
                                    icon={CIRCLE_INFO_ICON} 
                                    title={CURRENT_VALUE_TIPS}
                                />
                            </>
                        ),
                        dataIndex: 'currentValue',
                        width: '50%',
                        editable: true,
                        className: 'drag-visible',
                    }
                ]} 
                operations = {
                    (dataSource) => [
                        (
                            <TooltipButton 
                                type="purelink" 
                                label="Persist All" 
                                onClick={() => this.handlePersistAllBtnClick(dataSource)}
                                title={PERSIST_ALL_TIPS}
                            />
                        ),
                        (
                            <TooltipButton 
                                type="purelink" 
                                label="Reset All" 
                                onClick={() => this.handleResetAllBtnClick(dataSource)}
                                title={RESET_ALL_TIPS}
                            />
                        )
                    ]
                }
                cellOperations = {
                    (record, dataSource) => (
                        <Dropdown overlay={
                            <Menu onClick={(e) => this.handleCellOperationSel(e, record, dataSource)}>
                                <Menu.Item key="persist">
                                    Persist
                                </Menu.Item>
                                <Menu.Item key="reset">
                                    Reset
                                </Menu.Item>
                            </Menu>
                        } 
                        overlayStyle={{paddingTop: 10, width: 150}}
                        placement="bottomRight"
                        trigger="click">
                            <TooltipButton 
                                size="small" 
                                type="text" 
                                buttonProps={{style: {height: 10}}} 
                                title="View more actions" 
                                label={<EllipsisOutlined />} 
                                onClick={stopClickPropagation} 
                            />
                        </Dropdown>
                    )
                }
                dataSource={value}
                tableProps = {{
                    scroll: {y: 250},
                    style: {
                        maxWidth: 750
                    }
                }}
                onChange={this.handleVariableChange}
                onCellBlur={this.handleCellBlur}
            />
        )
    }
}

export default VariablesTable;
VariablesTable.defaultProps = {
    onChange: () => {},
}
