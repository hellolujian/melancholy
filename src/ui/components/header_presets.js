import React from 'react';
import {Modal, Button, Dropdown, Menu, Typography, Input, List, Form} from 'antd';

import { EllipsisOutlined, InfoCircleFilled ,CaretDownOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import KeyValueTable from './key_value_table'
import { UNSAVED_DOT_ICON, POST_REQUEST_ICON, GET_REQUEST_ICON, CLOSE_SVG, UNSAVED_DOT_SVG } from 'ui/constants/icons'
import {UUID, stopClickPropagation} from '@/utils/global_utils';
import {insertHeaderPreset, queryHeaderPreset, updateHeaderPreset} from '@/database/header_preset'

import 'ui/style/header_presets.css'

class HeaderPresets extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           headerPresets: []
        }
    }

    handleFormRef = (ref) => {
        if (ref) {
            this.formRef = ref;
        }
    }

    refreshData = async () => {
        let data = await queryHeaderPreset();
        this.setState({headerPresets: data});
    }

    componentDidMount() {
        this.refreshData();
    }

    handleItemClick = (item) => {
        console.log(item)
        this.setState({operateType: 'edit', currentPreset: item.preset}, () => {
            this.formRef.setFieldsValue(item);
        });
    }

    handleMenuClick = ({key}) => {
        if (key === 'managepresets') {
            this.setState({modalVisible: true});
        } else {
            const {headerPresets} = this.state;
            let targetHeadPreset = headerPresets.find(item => item.id === key);
            if (targetHeadPreset && targetHeadPreset.preset && targetHeadPreset.preset.length > 0) {
                this.props.onItemClick(targetHeadPreset.preset)
            }
        }
    }

    handleModalCancel = (e) => {
        this.setState({operateType: null, modalVisible: false});
    }

    handleAddClick = () => {
        this.setState({operateType: 'add', currentPreset: []})
    }

    handleCloseTabClick = async (id) => {
        await updateHeaderPreset(id, {$set: {deleted: true}})
        await this.refreshData()
    }

    handleFormFinish = async (changedValues) => {
        const {currentPreset} = this.state;
        if (changedValues.id) {
            await updateHeaderPreset(changedValues.id, {$set: {...changedValues, preset: currentPreset}})
        } else {
            await insertHeaderPreset({...changedValues, id: UUID(), preset: currentPreset})
        }
        await this.refreshData()
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

    handleCancelClick = (e) => {
        stopClickPropagation(e)
        this.setState({operateType: null});
    }

    handleKeyValueTableChange = (value) => {
        this.setState({currentPreset: value})
    }

    render() {
     
        let {modalVisible, operateType, headerPresets, currentPreset} = this.state;
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
                        {
                            headerPresets.map(item => (
                                <Menu.Item key={item.id}>
                                   {item.name}
                                </Menu.Item>
                            ))
                        }
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

                                <KeyValueTable 
                                    value={currentPreset}
                                    onChange={this.handleKeyValueTableChange}
                                />

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
                                        <List.Item 
                                            actions={[
                                                <Button 
                                                    type='text' 
                                                    icon={<Icon component={() => CLOSE_SVG} onClick={() => this.handleCloseTabClick(item.id)} />} 
                                                />
                                            ]}
                                        >
                                            <Button 
                                                type="text" 
                                                onClick={() => this.handleItemClick(item)}>
                                                {item.name}
                                            </Button> 
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







