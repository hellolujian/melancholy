import React from 'react';
import { Select, Table, Input, Button, Divider, Row, Col,Space, Typography,Dropdown, Menu, Checkbox, Tooltip } from 'antd';
import {stopClickPropagation, UUID} from '@/utils/global_utils';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { EllipsisOutlined, CloseOutlined ,MenuOutlined } from '@ant-design/icons';
import TooltipButton from './tooltip_button';
import 'ui/style/editable_table.css'
import arrayMove from 'array-move';
import RequestMethodSelect from './request_method_select'
import Ellipsis from 'react-ellipsis-component';
import TextareaAutosize from 'rc-textarea';
import RequestBodySelectFile from './request_body_select_file';

// import TextareaAutosize from "react-autosize-textarea"

// import Textarea from 'react-expanding-textarea'

const {Link} = Typography;
const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);
const {Option} = Select;

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      dataSource: props.defaultDataSource ? [...props.defaultDataSource] : [],
      currentEditCell: null,     // 当前处于编辑的单元格
      hideColumns: props.columns.filter(item => item.hide).map(item => item.name),    // 表格隐藏列名称
      tableId: UUID()
    };
  }

  getRealDataSource = () => {
    return this.props.hasOwnProperty('dataSource') ? (this.props.dataSource || []) : this.state.dataSource;
  }

  refreshDataSource(newDataSource, saveFlag = true) {
    this.setState({ dataSource: newDataSource });
    this.props.onChange(newDataSource, saveFlag);
  }

  handleSave = () => {
    this.props.onSave(this.getRealDataSource())
  }
  
  onSortEnd = ({ oldIndex, newIndex }) => {
    const dataSource = this.getRealDataSource();
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
      console.log('Sorted items: ', newData);
      this.refreshDataSource(newData);
    }
  };

  DraggableContainer = props => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const dataSource = this.getRealDataSource();
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x[this.props.rowKey] === restProps['data-row-key']);
    if (index !== -1) {
      return <SortableItem index={index} {...restProps} />;
    }
    return <tr {...restProps} />;
  };

  // 可编辑单元格聚焦
  handleEditCellInputFocus = (cellId) => {
    this.setState({currentHoverCell: cellId, currentEditCell: cellId}, () => {
      // document.getElementById(cellId).style.width = 'calc(100% - 1px) !important'
    });
  }

  handleEditCellInputBlur = (record, dataIndex, cellId) => {
    this.setState({currentEditCell: null});
    const dataSource = this.getRealDataSource();
    const {rowKey, onCellBlur} = this.props;
    let changedRecord = dataSource.find(item => item[rowKey] === record[rowKey])
    if (changedRecord) {
      changedRecord = onCellBlur(changedRecord, dataIndex);
      this.refreshDataSource(dataSource);
    }
  }

  // 生成当前单元格的唯一标识
  getCellId = (index, dataIndex) => {
    return index + "_" + dataIndex + "_" + this.state.tableId
  }

  getCellIdIndex = (cellId) => {
    return cellId ? cellId.split("_")[0] : undefined;
  }

  // 鼠标移动
  onMouseMove = (cellId) => {
    this.setState({currentHoverCell: cellId})
  }

  // 移除
  handleCloseBtnClick = (e, record) => {
    stopClickPropagation(e)
    const dataSource = this.getRealDataSource();
    const {rowKey} = this.props;
    const newDataSource = dataSource.filter(data => data[rowKey] !== record[rowKey])
    this.refreshDataSource(newDataSource);
  }

  // 展示列变更
  onColumnChkChange = (column, checked) => {
    let {hideColumns} = this.state;
    if (checked) {
      hideColumns = hideColumns.filter(item => item !== column.name);
    } else {
      hideColumns.push(column.name)
    }
    this.setState({hideColumns})
  }

  // 表格里的input变更
  handleCellInputChange = (record, dataIndex, value, cellId) => {
    
    const dataSource = this.getRealDataSource();
    const {rowKey, showCheckbox = 'disabled', scene} = this.props;
    let changedRecordIndex = dataSource.findIndex(item => item[rowKey] === record[rowKey])
    if (changedRecordIndex >= 0) {
      let newRecord = {...dataSource[changedRecordIndex], [dataIndex]: value};
      if (dataIndex === 'value' && scene === 'formdata') {
        delete newRecord.src;
      }
      dataSource[changedRecordIndex] = newRecord
    } else {
      let newObj = {...record, [dataIndex]: value, [rowKey]: UUID()};
      if (showCheckbox) {
        newObj[showCheckbox] = false;
      }
      dataSource.push(newObj)
    }
    this.setState({dataSource: dataSource}, () => {
      document.getElementById(cellId).focus()
    })
    this.props.onChange(dataSource, false);
  }

  handleCellCheckboxChange = (checked, record) => {
    const dataSource = this.getRealDataSource();
    const {rowKey} = this.props;
    let changedRecord = dataSource.find(item => item[rowKey] === record[rowKey]);
    if (changedRecord) {
      changedRecord.disabled = !checked;
      this.refreshDataSource(dataSource);
    } 
  }

  isCurrentRowHover = (currentIndex) => {
    const { currentHoverCell } = this.state;
    return currentHoverCell && this.getCellIdIndex(currentHoverCell) === (currentIndex + "")
  }

  isCurrentCellHover = (currentCellId) => {
    const { currentHoverCell } = this.state;
    return currentHoverCell === currentCellId;
  }

  isCurrentCellEdit = (currentCellId) => {
    const { currentEditCell } = this.state;
    return currentEditCell === currentCellId;
  }

  isCurrentRowEdit = (currentIndex) => {
    const { currentEditCell } = this.state;
    return currentEditCell && this.getCellIdIndex(currentEditCell) === (currentIndex + "")
  }

  handleKeyTypeChange = (value) => {

  }

  handleFileSelectd = (record, selectFiles, dataIndex) => {
    const dataSource = this.getRealDataSource();
    const {rowKey} = this.props;

    let changedRecordIndex = dataSource.findIndex(item => item[rowKey] === record[rowKey])
    if (changedRecordIndex >= 0) {
      dataSource[changedRecordIndex] = {...dataSource[changedRecordIndex], src: selectFiles, [dataIndex] : ''}
      this.refreshDataSource(dataSource);
    }
  }

  getRenderColumns = () => {
    
    const { hideColumns } = this.state;
    const {columns, showCheckbox = 'disabled', cellOperations = () => [], draggable = true, editable = true} = this.props;
    let realDataSource = this.getRealDataSource();
    const realColumns = [
      {
        title: '',
        dataIndex: 'sort',
        className: 'drag-visible',
        width: 45,
        render: (text, record, index) => {
          let dragStyle = {
            cursor: 'grab', color: '#999', 
            visibility: this.isCurrentRowHover(index) && !this.isCurrentRowEdit(index) ? 'visible' : 'hidden'
          }
         
          const DragHandle = sortableHandle(() => <MenuOutlined style={dragStyle} />);
          
          return index < realDataSource.length && draggable ? (
            <Space size={4}>
              <DragHandle />
              {
                showCheckbox && (
                  <Checkbox 
                    defaultChecked 
                    checked={!record[showCheckbox]}
                    onChange={(e) => this.handleCellCheckboxChange(e.target.checked, record)} 
                  />
                )
              }
            </Space>
          ) : null
        },
        onCell: (record, index) => {
         
          return {
            onMouseEnter: (event) => {
              this.onMouseMove(this.getCellId(index, 'sort'))
      
            },
            onMouseLeave: (event) => {
              this.onMouseMove(null)
            }
          }
        },
      }
    ];
    let renderColumns = columns.filter(item => !hideColumns.includes(item.name));
    renderColumns.forEach((col, colIndex) => {
      let extraObj = {};
      if (col.editable) {
        extraObj = {
          onCell: (record, index) => {
         
            return {
              onMouseEnter: (event) => {
                this.onMouseMove(this.getCellId(index, col.dataIndex))
        
              },
              onMouseLeave: (event) => {
                this.onMouseMove(null)
              },
              onClick: (event) => {

                this.setState({currentEditCell: this.getCellId(index, col.dataIndex)})
              }
            }
          },
          render: (text, record, index) => {
        
            let cellId = this.getCellId(index, col.dataIndex);
            let realCellOperations = []
            if (this.isCurrentRowHover(index) && !this.isCurrentRowEdit(index) ) {
              let parsedCellOperations = cellOperations(record, realDataSource, col, hideColumns, index);
              realCellOperations = Array.isArray(parsedCellOperations) ? [...parsedCellOperations] : [parsedCellOperations];
              if (colIndex === renderColumns.length - 1 && index < realDataSource.length) {
                realCellOperations.unshift(
                  <Button 
                    size="small"  
                    type="text" 
                    icon={<CloseOutlined />} 
                    style={{height: '100%'}}
                    onClick={(e) => this.handleCloseBtnClick(e, record)} 
                  />
                )
              }
            }
            let cellComponentType = col.dataIndex === 'value' ? (col.type || record.type) : undefined;
            let cellComponent;
            switch (cellComponentType) {
              case 'select':
                cellComponent = (
                  <RequestMethodSelect bordered={false} style={{width: 200}} size="small" />
                );
                break;
              case 'file': 
                cellComponent = (
                  <RequestBodySelectFile 
                    value={record.src} 
                    multiple
                    onSelect={(selectedFiles) => this.handleFileSelectd(record, selectedFiles, col.dataIndex)} 
                  />
                  
                )
                break;
              default: 
                cellComponent = this.isCurrentCellEdit(cellId) ? (
                  <Input.TextArea
                    className={"cell-textarea cell-textarea-edit"}
                    style={{zIndex: 9}}
                    id={cellId} 
                    value={text}
                    autoSize={true}
                    // autoFocus={true}
                    bordered={false}
                    placeholder={index === realDataSource.length ? col.placeholder : ''} 
                    onPressEnter={this.handleSave}
                    onFocus={() => this.handleEditCellInputFocus(cellId)} 
                    onBlur={() => this.handleEditCellInputBlur(record, col.dataIndex, cellId)} 
                    onChange={(e) => this.handleCellInputChange(record, col.dataIndex, e.target.value, cellId)}
                  />
                ) : (
                  <Input.TextArea
                    className={"cell-textarea cell-textarea-not-edit" + (index < realDataSource.length ? ' text-over-ellipsis' : '')}
                    style={{zIndex: 1}}
                    id={cellId} 
                    value={text}
                    bordered={false}
                    autoSize={{minRows: 1, maxRows: 1}}
                    onFocus={() => this.handleEditCellInputFocus(cellId)} 
                    rows={1}
                    placeholder={index === realDataSource.length ? col.placeholder : ''} 
                  />
                )
                break
            }
            return (
              <div 
              style={{height: '26px', }} 
              className="justify-content-space-between">
                {cellComponent}
                { realCellOperations }
              </div>
            )
          }
        }
        }
      if (colIndex === renderColumns.length - 1) {
        let operations = [];
        if (editable) {
          operations.push(
            <Dropdown overlay={
              <Menu>
                <Menu.ItemGroup title="SHOW COLLUMNS">
                  {
                    columns.filter(column => !!column.name).map(column => (
                      <Menu.Item key={column.name}>
                        <Checkbox 
                          checked={!hideColumns.includes(column.name)} 
                          onChange={(e) => this.onColumnChkChange(column, e.target.checked)}>
                          {column.name}
                        </Checkbox>
                      </Menu.Item>
                    ))
                  }
                  
                </Menu.ItemGroup>
              </Menu>
            } 
            
            trigger="click">
              <Tooltip title="View more actions">
                <Link>
                  <EllipsisOutlined className="ant-dropdown-link" />
                </Link>
              </Tooltip>
              
            </Dropdown>
          )
        }
        extraObj.title = (
          <Row style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 10}}>
            
            <Col>{col.title}</Col>
            
            <Col>
            {
              [...operations, ...this.props.operations(realDataSource)].map((operation, index) => (
                <span key={index}>
                  <Divider type="vertical" />
                  {operation}
                </span>

              ))
            }
            </Col>
          </Row>
         
        )
        if (!col.width) {
          extraObj.width = parseInt(1 / renderColumns.length * 100) + '%';
        }
      
      }
      realColumns.push({...col, ...extraObj})
    });

    return realColumns;
  }

  render() {
    const {rowKey, tableProps, editable = true} = this.props;
    let realDataSource = this.getRealDataSource();
    const components = {
      body: {
        wrapper: this.DraggableContainer,
        row: this.DraggableBodyRow,
      },
    };

    return (
      <Table
         className="common-editable-table"
         
         tableLayout="fixed"
          components={components}
          size="small"
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={editable ? [...realDataSource, {}] : realDataSource}
          columns={this.getRenderColumns()}
          rowKey={rowKey}
          pagination={false}
          // scroll={{y: 250 }}
          {...tableProps}
        />
    );
  }
}

export default EditableTable

EditableTable.defaultProps = {
  onChange: () => {},
  operations: () => [],
  onCellBlur: (record) => record,
  onSave: () => {},
}