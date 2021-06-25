import React from 'react';
import {Tooltip, Button, Dropdown, Menu} from 'antd';

import { EllipsisOutlined, InfoCircleFilled ,MenuOutlined } from '@ant-design/icons';
import EditableTable from './editable_table'
import TooltipButton from './tooltip_button'
class VariablesTable extends React.Component {

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
     
        return (
            <EditableTable 
                rowKey='index'
                ref={ref => this.editableTableRef = ref}
                columns={
                [
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
                                    icon={<InfoCircleFilled style={{fontSize: 5}} />} 
                                    title="This value is shared with your team when you share the variable in a collection, environment or globals." 
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
                                    icon={<InfoCircleFilled style={{fontSize: 5}} />} 
                                    title="This value is used while sending a request. Current values are never synced to Postman's servers. If left untouched, the current value automatically assumes the initial value." 
                                />
                            </>
                        ),
                        dataIndex: 'currentValue',
                        width: '58%',
                        editable: true,
                        className: 'drag-visible',
                    }
                ]
            } 
            operations = {
                (dataSource) => [
                    (
                        <TooltipButton 
                            type="purelink" 
                            label="Persist All" 
                            onClick={() => this.handlePersistAllBtnClick(dataSource)}
                            title="Persisting all values will replace all initial values with the current values of the variables." 
                        />
                    ),
                    (
                        <TooltipButton 
                            type="purelink" 
                            label="Reset All" 
                            onClick={() => this.handleResetAllBtnClick(dataSource)}
                            title="Resetting all values will replace all current values with the initial values of the variables." 
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
                      
                      trigger="click">
                        
                        <TooltipButton size="small" type="text" style={{height: 10}} title="View more actions" label={<EllipsisOutlined />} onClick={this.stopClickPropagation} />
                          
                      </Dropdown>
                )
            }
            dataSource={
                [
                    {
                      name: 'one',
                      initialValue: '32',
                      currentValue: 'London, Park Lane no. 0',
                      index: 0,
                    },
                    {
                      name: 'second',
                      initialValue: '32',
                      currentValue: 'London, Park Lane no. 1',
                      index: 1
                    },
                    // {
                    //   name: 'third',
                    //   initialValue: '32',
                    //   currentValue: 'London, Park Lane no. 1',
                    //   index: 2
                    // },
                    // {
                    //   name: 'second',
                    //   initialValue: '32',
                    //   currentValue: 'London, Park Lane no. 1',
                    //   index: 3
                    // },
                    // {
                    //   name: 'third',
                    //   initialValue: '32',
                    //   currentValue: 'London, Park Lane no. 1',
                    //   index: 4
                    // },
                    // {
                    //   name: 'second',
                    //   initialValue: '32',
                    //   currentValue: 'London, Park Lane no. 1',
                    //   index: 5
                    // },
                    // {
                    //   name: 'third',
                    //   initialValue: '32',
                    //   currentValue: 'London, Park Lane no. 1',
                    //   index: 6
                    // },
                    // {
                    //   name: 'second',
                    //   initialValue: '32',
                    //   currentValue: 'London, Park Lane no. 1',
                    //   index: 7
                    // },
                    // {
                    //   name: 'third',
                    //   initialValue: '32',
                    //   currentValue: 'London, Park Lane no. 1',
                    //   index: 8
                    // },
                    // {
                    //   name: 'second',
                    //   initialValue: '32',
                    //   currentValue: 'London, Park Lane no. 1',
                    //   index: 9
                    // },
                    // {
                    //   name: 'third',
                    //   initialValue: '32',
                    //   currentValue: 'London, Park Lane no. 1',
                    //   index: 10
                    // },
                    // {
                    //   name: 'second',
                    //   initialValue: '32',
                    //   currentValue: 'London, Park Lane no. 1',
                    //   index: 11
                    // },
                    // {
                    //   name: 'third',
                    //   initialValue: '32',
                    //   currentValue: 'London, Park Lane no. 1',
                    //   index: 12
                    // },
                  ]
            }
            />
        )
    }
}

export default VariablesTable;







