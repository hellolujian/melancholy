import React from 'react';
import { Table, Input, Button, Divider, Row, Col,Space, Typography,Dropdown, Menu, Checkbox, Tooltip } from 'antd';
import {stopClickPropagation} from '@/utils/global_utils';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { EllipsisOutlined, CloseOutlined ,MenuOutlined } from '@ant-design/icons';
import TooltipButton from './tooltip_button';
import 'ui/style/editable_table.css'
import arrayMove from 'array-move';

const {Link} = Typography;
const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      dataSource: [...props.dataSource],
      currentEditCell: null,     // 当前处于编辑的单元格
      hideColumns: [],    // 表格隐藏列名称
    };
  }
  
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = this.state;
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
      console.log('Sorted items: ', newData);
      this.setState({ dataSource: newData });
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
    const { dataSource } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x[this.props.rowKey] === restProps['data-row-key']);
    if (index !== -1) {
      return <SortableItem index={index} {...restProps} />;
    }
    return <tr {...restProps} />;
  };

  // 可编辑单元格聚焦
  handleEditCellInputFocus = (cellId) => {
    this.setState({currentHoverCell: cellId, currentEditCell: cellId})
  }

  handleEditCellInputBlur = (cellId) => {
    this.setState({currentEditCell: null})
  }

  // 生成当前单元格的唯一标识
  getCellId = (index, dataIndex) => {
    return index + "_" + dataIndex
  }

  // 鼠标移动
  onMouseMove = (cellId) => {
    this.setState({currentHoverCell: cellId})
  }

  // 移除
  handleCloseBtnClick = (e, record) => {
    stopClickPropagation(e)
    const {dataSource} = this.state;
    const {rowKey} = this.props;
    this.setState({dataSource: dataSource.filter(data => data[rowKey] !== record[rowKey])})
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

  setDataSourceState = (dataSource) => {
    this.setState({dataSource: dataSource})
  }

  // 表格里的input变更
  handleCellInputChange = (record, dataIndex, value, cellId) => {
    
    let {dataSource} = this.state;
    const {rowKey} = this.props;
    let changedRecord = dataSource.find(item => item[rowKey] === record[rowKey])
    if (changedRecord) {
      changedRecord[dataIndex] = value;
    } else {
      dataSource.push({...record, [dataIndex]: value, [rowKey]: dataSource.length + 1})
      
    }
    this.setState({dataSource: dataSource}, () => {
      document.getElementById(cellId).focus()
    })
  }

  render() {
    const { dataSource, currentHoverCell, currentEditCell, hideColumns } = this.state;
    const {columns, cellOperations, rowKey, tableProps, draggable = true, editable = true} = this.props;
    const components = {
      body: {
        wrapper: this.DraggableContainer,
        row: this.DraggableBodyRow,
      },
    };
    const realColumns = [
      {
        title: '',
        dataIndex: 'sort',
        className: 'drag-visible',
        width: 45,
        render: (text, record, index) => {
          let dragStyle = {
            cursor: 'grab', color: '#999', 
            visibility: currentHoverCell && currentHoverCell.split("_")[0] === (index + "") && (!currentEditCell || currentEditCell.split("_")[0] !== (index + "")) ? 'visible' : 'hidden'
          }
         
          const DragHandle = sortableHandle(() => <MenuOutlined style={dragStyle} />);
          
          return index < dataSource.length && draggable ? (
            <Space size={4}>
              <DragHandle />
              <Checkbox defaultChecked />
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
            let {currentHoverCell, currentEditCell} = this.state;
        
            let cellId = this.getCellId(index, col.dataIndex);
            let className = 'editable-cell-value-wrap';
            if (currentEditCell === cellId) {
              className = className + ' editable-cell-value-wrap-edit'
            }
            return (
              <div className={className} style={{display: 'flex'}}>
                <Input 
                  id={cellId}
                  bordered={false}
                  onFocus={() => this.handleEditCellInputFocus(cellId)} 
                  size="small" 
                  value={text}
                  placeholder={index === dataSource.length ? col.placeholder : ''} 
                  // onPressEnter={this.save} 
                  onBlur={() => this.handleEditCellInputBlur(cellId)} 
                  onChange={(e) => this.handleCellInputChange(record, col.dataIndex, e.target.value, cellId)}
                />
                {
                  currentHoverCell && currentHoverCell.split("_")[0] === (index + "") && index < dataSource.length &&
                  (!currentEditCell || currentEditCell.split("_")[0] !== (index + "")) && (colIndex === renderColumns.length - 1) && (
                    <>
                      <Button size="small" type="text" icon={<CloseOutlined />} style={{height: 10}} onClick={(e) => this.handleCloseBtnClick(e, record)} />
                      { cellOperations && cellOperations(record, dataSource) }
                    </>
                  )
                }
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
              {/* <TooltipButton 
                type="purelink" title="View more actions"
                label={<EllipsisOutlined className="ant-dropdown-link" />} 
              /> */}
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
              [...operations, ...this.props.operations(dataSource)].map((operation, index) => (
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
    
    return (
      <Table
          components={components}
          size="small"
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={editable ? [...dataSource, {}] : dataSource}
          columns={realColumns}
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
  onCellValueChange: () => {}
}