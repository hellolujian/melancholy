import React from 'react';
import { render } from 'react-dom';
import {List, PageHeader, Button, Row, Col, Input, Typography, Space} from 'antd'
import { CaretLeftOutlined, SearchOutlined, CaretRightOutlined, CheckOutlined} from '@ant-design/icons';
import 'ui/style/collection_select_card.css'
import {GOU_ICON, YES_ICON, COLLECTION_ICON_20, COLLECTION_ICON, ENVIRONMENT_ICON, ENVIRONMENT_ICON_48,
    MOCK_COLLECTION, MOCK_COLLECTION_48, MONITOR_COLLECTION_ICON, CIRCLE_DOT_ICON, DOCUMENTATION_ICON, DOCUMENTATION_ICON_48, CLOSE_SVG,CLOSE_ICON
} from 'ui/constants/icons';

class CollectionSelectCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            creating: false,
            collectionName: '',
            
        }
    }
    editorDidMount(editor, monaco) {
        console.log('editorDidMount', editor);
        editor.focus();
    }
    onChange(newValue, e) {
        console.log('onChange', newValue, e);
    }

    handleCreateBtnClick = () => {
        this.setState({creating: true});
    }

    handleCloseBtnClick = () => {
        this.setState({creating: false});
    }

    handleCollectionCreateInputChange = (e) => {
        this.setState({collectionName: e.target.value})
    }

    handleListItemClick = (item) => {
        this.setState({selectedCollection: item})
    }

    handleBackIconClick = () => {
        this.setState({selectedCollection: null})
    }

    render() {

        let data = [

        {
            id: '1',
            name: 'api-new'
        },
        {
            id: '2',
            name: 'api-seller-manager'
        },
        {
            id: '3',
            name: 'api-open'
        },
        {
            id: '4',
            name: 'api-open'
        },
        {
            id: '12',
            name: 'api-seller-manager'
        },
        {
            id: '13',
            name: 'api-open'
        },
        {
            id: '14',
            name: 'api-open'
        },
        ];
        const {creating, collectionName, selectedCollection} =this.state;
        return (
            <PageHeader 
                className="collection-select-card"
                breadcrumbRender={() => (
                    <div className="collection-select-card-top">
                        <Input placeholder="Search for a collection or folder" prefix={<SearchOutlined />} />
                    </div>
                )}
                backIcon={selectedCollection ? (
                    <Space>
                        <CaretLeftOutlined />
                        <div style={{paddingBottom: 3}}>{selectedCollection.name}</div>
                    </Space>
                ) : false}
                onBack={this.handleBackIconClick}
            
                subTitle={selectedCollection ? null : 'All Collections'}
                extra={[
                    <Button 
                        type="link" 
                        onClick={this.handleCreateBtnClick}>
                        + Create Folder
                    </Button>
                ]}
            >

                {
                    creating && (
                        <div className="collection-select-card-create-collection-input">
                            <Input 
                                autoFocus
                                onChange={this.handleCollectionCreateInputChange}
                                className="antd-main-border-color"
                                bordered={false}
                                suffix={collectionName && (
                                    CLOSE_ICON(this.handleCloseBtnClick)
                                )}
                                addonAfter={collectionName && (YES_ICON)}
                                // onBlur={this.handleCreateBtnBlur}
                            />
                        </div>
                    )
                }

                <List
                    size="small"
                    // bordered
                    dataSource={data}
                    renderItem={item => (
                        <List.Item 
                            key={item.id}
                            className="collection-select-card-item"
                            actions={[
                                <CaretRightOutlined className="collection-select-card-item-right" />
                            ]}
                            onClick={() => this.handleListItemClick(item)}>
        
                            <div className="vertical-center">
                            {COLLECTION_ICON_20}
                            <Typography.Text style={{marginLeft: 8}}>{item.name}</Typography.Text>
                            </div>

                        </List.Item>
                    )}
                />

            </PageHeader>
        )

    }
}
export default CollectionSelectCard;







