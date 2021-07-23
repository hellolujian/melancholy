import React from 'react';
import {Modal, Button, Dropdown, Menu, Typography, Input, List, Form} from 'antd';

import { EllipsisOutlined, InfoCircleFilled ,CaretDownOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import KeyValueTable from './key_value_table'
import { UNSAVED_DOT_ICON, POST_REQUEST_ICON, GET_REQUEST_ICON, CLOSE_SVG, UNSAVED_DOT_SVG } from 'ui/constants/icons'
import {stopClickPropagation} from '@/utils/global_utils';

import 'ui/style/header_presets.css'

class HeaderPresets extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           headerPresets: [...new Array(50).keys()].map((item, index) => {
               return {
                   id: index, name: index
               }
           })
        }
    }

    componentDidMount() {
      
    }

    handleMenuClick = ({key}) => {
        if (key === 'managepresets') {
            this.setState({modalVisible: true});
        }
        
    }

    handleModalCancel = (e) => {
        this.setState({operateType: null, modalVisible: false});
    }

    handleAddClick = () => {
        this.setState({operateType: 'add'})
    }

    handleFormRef = (ref) => {
        if (ref) {
            this.formRef = ref;
        }
    }
    handleModalOk = () => {
        
        this.formRef.validateFields().then((values) => {
            if (!values.errorFields) {
                this.formRef.submit();
                this.setState({operateType: null});
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    handleFormValuesChange = (changedValues, allValues) => {
       
    }

    handleCloseTabClick = (id) => {
        const {headerPresets} = this.state;
        this.setState({headerPresets: headerPresets.filter(preset => preset.id !== id)})
    }

    handleFormFinish = (changedValues) => {
        console.log(changedValues)
        const {headerPresets} = this.state;
        let changedOne = headerPresets.find(preset => preset.id === changedValues.id);
        if (changedOne) {
            changedOne.name = changedValues.name;
        } else {
            headerPresets.push({id: new Date().getTime(), name: "new_" + headerPresets.length})
        }

        this.setState({headerPresets: headerPresets})
    }

    handleItemClick = (item) => {
        console.log(item)
        this.setState({operateType: 'edit'}, () => {
            this.formRef.setFieldsValue(item)
        });
    }

    handleCancelClick = (e) => {
        stopClickPropagation(e)
        this.setState({operateType: null});
    }
    render() {
     
        let {modalVisible, operateType, headerPresets} = this.state;
        let footerButtonProps = {};
        if (!operateType) {
            footerButtonProps.style = {
                visibility: 'hidden', opacity: 0
            }
        }
        return (
            <>
            
                <Dropdown overlay={(
                    <Menu onClick={this.handleMenuClick}>
                        <Menu.Item key="managepresets">
                            Manage Presets
                        </Menu.Item>
                    </Menu>)
                } >
                    <Button type="link" size="small">Presets<CaretDownOutlined /></Button>
                </Dropdown>

                <Modal 
                    title="MANAGE HEADER PRESETS" 
                    className="header-presets-modal"
                    centered
                    bodyStyle={{ height: 600}}
                    width={800}
                    visible={modalVisible} 
                    onCancel={this.handleModalCancel}
                    onOk={this.handleModalOk}
                    okText={operateType === 'add' ? 'Add' : 'Update'}
                    okButtonProps={footerButtonProps}
                    cancelButtonProps={{...footerButtonProps, onClick: this.handleCancelClick}}
                >
                    {
                        operateType ? (
                            <Form layout="vertical" ref={this.handleFormRef} onValuesChange={this.handleFormValuesChange} onFinish={this.handleFormFinish}>
                                <Form.Item
                                    name="id" hidden
                                >
                                    <Input placeholder="Header Preset Name" />
                                </Form.Item>
                                <Form.Item
                                    name="name"
                                    label={<Typography.Text strong>Add Header Preset</Typography.Text>}
                                    rules={[{ required: true, message: '' }]}
                                >
                                    <Input placeholder="Header Preset Name" />
                                </Form.Item>

                                <KeyValueTable />

                            </Form>
                        ) : (
                            <>
                            <Typography.Paragraph>
                                Quickly add groups of header key/value pairs to the request. Start typing the name of the preset name and it'll show up in the dropdown list.
                            </Typography.Paragraph>
                            <Button type="primary" onClick={this.handleAddClick}>
                                Add
                            </Button>
                            <List
                                className="header-presets-list"
                                dataSource={headerPresets}
                                renderItem={item => (
                                    <List.Item actions={[
                                        <Button type='text' icon={<Icon component={() => CLOSE_SVG} onClick={() => this.handleCloseTabClick(item.id)} />} />
                                      ]}>
                                    <Button type="text" onClick={() => this.handleItemClick(item)}>{item.name}</Button> 
                                    </List.Item>
                                )}
                            />
                            </>
                        )
                    }
                    
                

                </Modal>
            </>
        )
    }
}

export default HeaderPresets;







