import React from 'react';
import {Tooltip, Button, Dropdown, Menu} from 'antd';

import { EllipsisOutlined, InfoCircleFilled ,CaretDownOutlined } from '@ant-design/icons';
import EditableTable from './editable_table'
import TooltipButton from './tooltip_button'
import HeaderPresets from './header_presets'
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
     
        const {scene, editable = true, draggable = true, tableProps} = this.props;
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
       
            dataSource={
                [
                //     {
                //       name: 'one',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 0',
                //       index: 0,
                //     },
                //     {
                //       name: 'second',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 1
                //     },
                //     {
                //       name: 'third',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 2
                //     },
                //     {
                //       name: 'second',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 3
                //     },
                //     {
                //       name: 'third',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 4
                //     },
                //     {
                //       name: 'second',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 5
                //     },
                //     {
                //       name: 'third',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 6
                //     },
                //     {
                //       name: 'second',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 7
                //     },
                //     {
                //       name: 'third',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 8
                //     },
                //     {
                //       name: 'second',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 9
                //     },
                //     {
                //       name: 'third',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 10
                //     },
                //     {
                //       name: 'second',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 11
                //     },
                //     {
                //       name: 'third',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 12
                //     },
                //   {
                //       name: 'third',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 2
                //     },
                //     {
                //       name: 'second',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 3
                //     },
                //     {
                //       name: 'third',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 4
                //     },
                //     {
                //       name: 'second',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 5
                //     },
                //     {
                //       name: 'third',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 6
                //     },
                //     {
                //       name: 'second',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 7
                //     },
                //     {
                //       name: 'third',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 8
                //     },
                //     {
                //       name: 'second',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 9
                //     },
                //     {
                //       name: 'third',
                //       initialValue: '32',
                //       currentValue: 'London, Park Lane no. 1',
                //       index: 10
                //     },
                    {
                      name: 'second',
                      initialValue: '32',
                      currentValue: 'London, Park Lane no. 1',
                      index: 11
                    },
                    {
                      name: 'third',
                      initialValue: '32',
                      currentValue: 'London, Park Lane no. 1',
                      index: 12
                    },
                  ]
            }
            // tableProps = {{
            //     title: () => 'Query Params'
            // }}
            />
        )
    }
}

export default VariablesTable;







