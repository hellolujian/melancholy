import React from 'react';
import { 
    Layout, Menu, 
    Space,Row, Col ,Input,
    Tabs, Table,Tree, Select, 
} from 'antd';
import { PlusOutlined, SearchOutlined,} from '@ant-design/icons';
import CollectionModal from 'ui/components/collection_modal'
import TooltipButton from 'ui/components/tooltip_button';
import RequestTabs from 'ui/components/request_tabs'
import LayoutHeader from 'ui/components/layout_header'
import CollectionTree from 'ui/components/collection_tree'
import ResponseTab from 'ui/components/response_tab'

import KeyValueTable from 'ui/components/key_value_table'
import {Rnd} from 'react-rnd';
import {ADD_ICON} from 'ui/constants/icons'
import {publishCollectionModalOpen} from '@/utils/event_utils'
import TextareaAutosize from "react-autosize-textarea"
import 'ui/style/common.css'
import 'ui/style/layout.css'
import 'ui/style/global.css'
import 'ui/style/test.css'

const { TabPane } = Tabs;
const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;
const { DirectoryTree } = Tree;
const {Option} = Select;

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          width: 350,
          tabActiveKey: 'collections',
          
          snippetContainerHeight: 200,
          outContainerHeight: 350, 
          dynamicWidth: 350
        }
    }

    

    handleResizeStop = (e, direction, ref, delta, position) => {
      this.setState({
        width: this.state.width + delta.width
      });
    }

  handleResize = (e, direction, ref, delta, position) => {
    console.log(delta.width);
      let newWidth = this.state.width + delta.width;
      this.setState({dynamicWidth: newWidth });
  }



    handleWindowResize = (e) => {
      this.setState({contentWidth: e.target.innerWidth - this.state.width})
    }

    componentDidMount() {
      this.setState({contentWidth: window.innerWidth - this.state.width})
      window.addEventListener('resize', this.handleWindowResize)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowResize)
    }

    onResize = (event, {element, size, handle}) => {
      if (size.width < 250) {
        return;
      }
      this.setState({width: size.width, height: size.height});
    }

    handleSelectTreeNode = (selectedKeys, e) => {
      console.log(e);
      this.setState({expandedKeys: selectedKeys});
    }

    handleNewCollectionClick = () => {
      publishCollectionModalOpen();
    }

    handleTabChange = (key) => {
      this.setState({tabActiveKey: key})
    }
    
  // 生成当前单元格的唯一标识
  getCellId = (index, dataIndex) => {
    return index + "_" + dataIndex + "_" + this.state.tableId
  }

  // 鼠标移动
  onMouseMove = (cellId) => {
    const {currentEditCell} = this.state;
    if (currentEditCell) return;
    this.setState({currentHoverCell: cellId})
  }

  
  getCellIdIndex = (cellId) => {
    return cellId ? cellId.split("_")[0] : undefined;
  }
  
  getCellDataIndex = (cellId) => {
    return cellId ? cellId.split("_")[1] : undefined;
  }

  isCurrentHover = (currentIndex, dataIndex) => {
    const { currentHoverCell } = this.state;
    return currentHoverCell && this.getCellIdIndex(currentHoverCell) === (currentIndex + "") && this.getCellDataIndex(currentHoverCell) === dataIndex
  }

  isCurrentEdit = (currentIndex, dataIndex) => {
    const { currentEditCell } = this.state;
    return currentEditCell && this.getCellIdIndex(currentEditCell) === (currentIndex + "") && this.getCellDataIndex(currentEditCell) === dataIndex
  }

  
  // 可编辑单元格聚焦
  handleEditCellInputFocus = (cellId) => {
    this.setState({currentHoverCell: cellId, currentEditCell: cellId})
  }

  handleEditCellInputBlur = (record, dataIndex, cellId) => {
    this.setState({currentEditCell: null});
   
  }
  // 表格里的input变更
  handleCellInputChange = (record, dataIndex, value, cellId) => {
    
   
  }



    render() {

    let columns = [{dataIndex: 'key', title: "KEY"}, {dataIndex: 'value', title: "VALUE"}, {dataIndex: 'desc', title: 'DESC'}]
      const {tabActiveKey, dynamicWidth} = this.state;
        return (
          true ? 
          <>
          <Input.TextArea className="my-textarea" autoSize
          // size="small" 
          />
          <TextareaAutosize
                      />
          </>
          :
          <div>
            <Table
              size="small"
              rowClassName={() => 'editable-row'}
              bordered
              tableLayout="fixed"
              dataSource={[{key: 'key', value: 'value', desc: 'desc'}, {key: 'key2', value: 'value2', desc: 'desc2'}]}
              columns={columns.map(column => {
                return {
                  ...column,
                  // fixed: 'left',
                  onCell: (record, index) => {
          
                    return {
                      onMouseEnter: (event) => {
                        this.onMouseMove(this.getCellId(index, column.dataIndex))
                
                      },
                      onMouseLeave: (event) => {
                        this.onMouseMove(null)
                      },
                      onClick: (event) => {
        
                        this.setState({currentEditCell: this.getCellId(index, column.dataIndex)}, () => {
                          document.getElementById(this.getCellId(index, column.dataIndex)).focus()
                        })
                      }
                    }
                  },
                  render: (text, record, index) => {
                    let {currentEditCell} = this.state;
                    let cellId = this.getCellId(index, column.dataIndex);
                    let textarea = (
                      
                    <TextareaAutosize
                      // style={{width: 'calc(100% - 90px)'}}
                    style={{zIndex: currentEditCell === cellId ? 9999 : 1, overflow: currentEditCell === cellId ? '' : 'hidden !important',overflowY: currentEditCell === cellId ? '' : 'hidden !important', width: 'calc(100% - 90px)'}}
                    className={"cell-textarea " + (currentEditCell === cellId ? "" : "text-over-ellipsis")}
                    id={cellId} 
                    // value={text}
                    maxRows={currentEditCell === cellId ? 999 : 1}
                    // placeholder={index === realDataSource.length ? col.placeholder : ''} 
                    // onPressEnter={this.handleSave}
                    onFocus={() => this.handleEditCellInputFocus(cellId)} 
                    onBlur={() => this.handleEditCellInputBlur(record, column.dataIndex, cellId)} 
                    onChange={(e) => this.handleCellInputChange(record, column.dataIndex, e.target.value, cellId)}
                  />
                    )
                    return (
                      <div style={{height: '24px'}}>
                        {textarea}
                        {
                          
                          this.isCurrentHover(index, column.dataIndex) && !this.isCurrentEdit(index, column.dataIndex) && (
                            <Select 
                          // value={record.type}
                          // style={{display: col.dataIndex !== 'key' ? 'none' : '', zIndex: 10, flexShrink: 0}}
                          className="request-body-formdata-table-select" 
                          defaultValue="text" size="small" 
                          // bordered={false} 
                          onChange={this.handleKeyTypeChange}
                          // onClick={stopClickPropagation}
                          >
                          <Option value="text">Text</Option>
                          <Option value="file">File</Option>
                        </Select>
                          )
                        }
                      </div>
                    )
                  }
                }
              })}
              // rowKey={rowKey}
              pagination={false}
              // scroll={{y: 250 }}
              // {...tableProps}
            />
          </div>
            
        )
    }
}

export default Home;




