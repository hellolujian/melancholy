import React from 'react';
import {Upload, Tabs , Space, Typography, Card, Row, Col, Button, Input, Modal, notification} from 'antd';

import TooltipButton from '../tooltip_button'
import PostmanButton from '../postman_button'
import ButtonModal from '../button_modal'
import ImportCollectionConfirm from '../import_collection_confirm'
import {deleteCollection, saveCollection, importCollection} from '@/utils/database_utils'

import CommonSelectFile from '../common_select_file'
import {queryCollectionMetaById, queryCollectionMetaByName} from '@/database/collection_meta'
import {queryRequestMetaById} from '@/database/request_meta'
import {queryAllEnvironmentMeta, queryEnvironmentMeta} from '@/database/environment_meta'
import {queryAllHeaderPreset} from '@/database/header_preset'
import {ImportType} from '@/enums'

import {publishCollectionSave} from '@/utils/event_utils'
import {importFromFile, importFromFilePath} from '@/utils/business_utils'
import {UUID, writeJsonFileSync, getJsonFromFile} from '@/utils/global_utils'
import {getFullUrl, getExportEnabledKeyValueArr, getEventExportObj, getVariableExportEnabledArr, getVariableExportDisabledArr} from '@/utils/common_utils'
import {IMPORT_TITLE, SYNC_DATA_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'
import {
    IMPORT_FILE_TIPS,
    VARIABLE_VALUE_TIPS,
    ENVIRONMENT_EXT_TIPS,
    GLOBALS_TIPS
} from 'ui/constants/tips'
import PostmanSDK from 'postman-collection' 
import { ToastContainer, toast } from 'react-toastify';
import {
    loadCollection
} from '@/utils/database_utils'

import {RequestBodyModeType} from '@/enums'

import { setTheme, getCurrentTheme } from '@/utils/style_utils';
const {Item, ItemGroup, RequestAuth} = PostmanSDK;
const { Dragger } = Upload;
const { TabPane } = Tabs;
const {Paragraph, Text, Title} = Typography;
class DataSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           theme: getCurrentTheme()
        }
    }

    componentDidMount() {
        
    }

    handleTabKeyChange = (activeTabKey) => {
        this.setState({activeTabKey: activeTabKey})
    }

    handleRadioChange = (e) => {

        this.setState({radioValue: e.target.value});

    }

    handleChangeTheme = (theme) => {
        setTheme(theme)
        this.setState({theme: theme})
    }

    render() {
     
        const {title, color = 'gray', label} = this.props
        const {theme} = this.state;
  
        return (

            <Row justify="center">
            <Col 
                span={10}>
                <Card 
                    hoverable 
                    className="theme-item-class"
                    style={{
                        border: theme !== 'dark' ? '3px solid var(--primary-color, #F26b3a)' : '0px'
                    }}
                    bodyStyle={{display: 'none'}}
                    cover={
                        <img
                          alt="dark"
                          src="/assets/default_theme.png"
                        />
                    }
                    onClick={() => this.handleChangeTheme('default')}
                    
                >
                    
                </Card>
            </Col>
                <Col 
                    span={10} >
                    <Card 
                        bordered={theme === 'dark'} 
                        className="theme-item-class"
                        hoverable 
                        style={{
                            border: theme === 'dark' ? '3px solid var(--primary-color, #F26b3a)' : '0px'
                        }}
                        bodyStyle={{display: 'none'}}
                        cover={
                            <img
                              alt="dark"
                              src="/assets/dark_theme.png"
                            />
                        }
                        onClick={() => this.handleChangeTheme('dark')}
                        
                    >
                        
                    </Card>
                </Col>
            </Row>
            // <Space direction="vertical" size="large">
            //     <Space direction="vertical">
            //         <Title level={3}>
            //             Export data
            //         </Title>
            //         <Text>
            //         Export all your collections, environments, globals and header presets to a single dump file. 
            //         </Text>
            //         <Text type="secondary" style={{fontSize: 12 }}>Note: Exporting a data dump will save your globals from different workspaces as individual environments.</Text>
            //         {/* <Radio.Group onChange={this.handleRadioChange} value={radioValue || 1}>
            //             <Space direction="vertical">
            //                 <Radio value={1}>Download only my data</Radio>
            //                 <Radio value={2}>Download all data including data in workspaces I have joined</Radio>
            //             </Space>
            //         </Radio.Group> */}
            //         <CommonSelectFile 
            //             mode="save"
            //             label="Download"
            //             title="Select path to save file"
            //             defaultPath={"Backup.postman_dump.json"}
            //             onSelect={(filePath) => this.handleDownloadClick(filePath)}
            //             buttonProps={{type: 'primary'}}
            //         />
            //     </Space>
                
            // </Space>
            
        )
    }
}

export default DataSettings;







