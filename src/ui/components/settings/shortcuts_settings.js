import React from 'react';
import {Divider, Tooltip, Button, Typography, Row, Col, List, Switch, Input, Select } from 'antd';
import {setStoreValue, getStoreValue} from '@/utils/store_utils'

const {Link} = Typography;
class ShortcutsSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            switchChecked: getStoreValue('shortcutSwitch')
        }
    }

    componentDidMount() {
      
    }

    SHORTCUTS_SETTINGS = [
        {
            title: 'TABS',
            items: [
                {label: 'Open New Tab', shortcut: 'Ctrl + T'},
                {label: 'Close Tab', shortcut: 'Ctrl + W'},
                {label: 'Force Close Tab', shortcut: 'Ctrl +  Alt + W'},
                {label: 'Switch To Next Tab', shortcut: 'Ctrl + Shift + →'},
                {label: 'Switch To Previous Tab', shortcut: 'Ctrl + Shift + ←'},
                {label: 'Switch To Tab at Position', shortcut: 'Ctrl + 1 through Ctrl + 8'},
                {label: 'Switch To Last Tab', shortcut: 'Ctrl + 9'},
                {label: 'Reopen Last Closed Tab', shortcut: 'Ctrl + Shift + t'},
            ]
        },
        {
            title: 'Request',
            items: [
                {label: 'Request URL', shortcut: 'Ctrl + L'},
                {label: 'Save Request', shortcut: 'Ctrl + S'},
                {label: 'Save Request As', shortcut: 'Ctrl + Shift + S'},
                {label: 'Send Request', shortcut: 'Ctrl + Enter'},
                {label: 'Send And Download Request', shortcut: 'Ctrl + Alt + Enter'},
                {label: 'Scroll To Request', shortcut: 'Ctrl + Alt + ↑'},
                {label: 'Scroll To Response', shortcut: 'Ctrl + Alt + ↓'},
            ]
        },
        {
            title: 'SIDERBAR',
            items: [
                {label: 'Search Sidebar', shortcut: 'Ctrl + F'},
                {label: 'Toggle Sidebar', shortcut: 'Ctrl + \\'},
                {label: 'Next Item', shortcut: '↓'},
                {label: 'Previous Item', shortcut: '↑'},
                {label: 'Expand Item', shortcut: '→'},
                {label: 'Collapse Item', shortcut: '←'},
                {label: 'Select Item', shortcut: 'Enter'},
                {label: 'Open Request In A New Tab', shortcut: 'Ctrl + Shift + click'},
                {label: 'Rename Item', shortcut: 'Ctrl + E'},
                {label: 'Group Items', shortcut: 'Ctrl + G'},
                {label: 'Cut Item', shortcut: 'Ctrl + X'},
                {label: 'Copy Item', shortcut: 'Ctrl + C'},
                {label: 'Paste Item', shortcut: 'Ctrl + V'},
                {label: 'Duplicate Item', shortcut: 'Ctrl + D'},
                {label: 'Delete Item', shortcut: 'Del'},
            ]
        },
        {
            title: 'INTERFACE',
            items: [
                {label: 'Zoom In', shortcut: 'Ctrl + +'},
                {label: 'Zoom Out', shortcut: 'Ctrl + -'},
                {label: 'Reset Zoom', shortcut: 'Ctrl + 0'},
                {label: 'Toggle Two-Pane View', shortcut: 'Ctrl + Alt + V'},
                {label: 'Switch Workspace View', shortcut: 'Ctrl + .'}
            ]
        },
        {
            title: 'WINDOWS AND MODALS',
            items: [
                {label: 'New...', shortcut: 'Ctrl + N'},
                {label: 'New Postman Window', shortcut: 'Ctrl + Shift + N'},
                {label: 'New Runner Window', shortcut: 'Ctrl + Shift + R'},
                {label: 'New Console Window', shortcut: 'Ctrl + Alt + C'},
                {label: 'Find', shortcut: 'Ctrl + Shift + F'},
                {label: 'Import', shortcut: 'Ctrl + O'},
                {label: 'Manage Environments', shortcut: 'Ctrl + Alt + E'},
                {label: 'Settings', shortcut: 'Ctrl + ,'},
                {label: 'Submit Modal', shortcut: 'Ctrl + ↵'},
                {label: 'Open Shortcut Help', shortcut: 'Ctrl + /'}
            ]
        }
    ]

    handleSwitchChange = (checked) => {
        this.setState({switchChecked: checked});
        setStoreValue('shortcutSwitch', checked);
    }

    render() {

        const {switchChecked = true} = this.state;
    
        return (
            <>
                <p className="justify-content-space-between">
                    <Typography.Text strong>Shortcuts</Typography.Text>
                    <Switch 
                        checkedChildren="ON" 
                        unCheckedChildren="OFF" 
                        checked={switchChecked} 
                        onChange={this.handleSwitchChange}
                    />
                </p>
                <Divider />
                {
                    this.SHORTCUTS_SETTINGS.map(item => (
                        <List
                            size="small"
                            key={item.title}
                            split={false}
                            header={<Typography.Text strong type="secondary">{item.title}</Typography.Text>}
                            dataSource={item.items}
                            renderItem={item => {
                                return (
                                    <Row className="full-width" gutter={[16, 16]}>
                                        <Col flex="10px"></Col>
                                        <Col span={15}>
                                            <Typography.Text type={!switchChecked && "secondary"}>{item.label}</Typography.Text>
                                        </Col>
                                        <Col span={8}>
                                            <Typography.Text type={!switchChecked && "secondary"}>{item.shortcut}</Typography.Text>
                                        </Col>
                                    </Row>
                                )
                            }}
                        />
                    ))
                }
            </>
        )
    }
}

export default ShortcutsSettings;







