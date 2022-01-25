import React from 'react';
import { render } from 'react-dom';
import {List, PageHeader, Button, Row, Col, Input, Typography, Space} from 'antd'
import { CaretLeftOutlined, SearchOutlined, CaretRightOutlined, CheckOutlined} from '@ant-design/icons';
import 'ui/style/collection_select_card.css'
import {POST_REQUEST_ICON, YES_ICON, COLLECTION_ICON_20, GET_REQUEST_ICON, ENVIRONMENT_ICON, ENVIRONMENT_ICON_48,
    MOCK_COLLECTION, MOCK_COLLECTION_48, MONITOR_COLLECTION_ICON, CIRCLE_DOT_ICON, DOCUMENTATION_ICON, DOCUMENTATION_ICON_48, CLOSE_SVG,CLOSE_ICON
} from 'ui/constants/icons';

import {loadCollection, getParentArr, newCollection} from '@/utils/database_utils'
import {publishCollectionSave} from '@/utils/event_utils'

import {UUID} from '@/utils/global_utils'
class CollectionSelectCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            creating: false,
            collectionName: '',
            chooseChain: [],
            collectionData: []
        }
    }

    refreshData = async (obj = {}) => {
        let collectionData = await loadCollection();
        this.setState({collectionData: collectionData, ...obj});
    }

    componentDidMount = async () => {
        const {defaultValue} = this.props;
        let chooseChain = [];
        if (defaultValue) {
            chooseChain = await getParentArr(defaultValue.id)
        }
        await this.refreshData({chooseChain: chooseChain});
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

    getChoosedCollectionId = () => {
        const {chooseChain} = this.state;
        return chooseChain.length > 0 ? chooseChain[chooseChain.length - 1].id : null;
    }

    handleYesBtnClick = async () => {
        const {collectionName, chooseChain} = this.state;
        let choosedCollection = {id: UUID(), name: collectionName}
        await newCollection(choosedCollection, this.getChoosedCollectionId());
        chooseChain.push(choosedCollection)
        await this.refreshData({chooseChain: chooseChain, });
        this.setState({creating: false})
        publishCollectionSave();
        
        this.props.onChange(choosedCollection);
    }

    handleCollectionCreateInputChange = (e) => {
        this.setState({collectionName: e.target.value})
    }

    handleListItemClick = (item) => {
        const {chooseChain} = this.state;
        if (!item.items && chooseChain.length > 0) {
            return;
        }
        chooseChain.push({id: item.id, name: item.name})
        this.setState({chooseChain: chooseChain});
        this.props.onChange(item);
    }

    handleBackIconClick = () => {
        const {chooseChain} = this.state;
        chooseChain.pop();
        this.setState({chooseChain: chooseChain});
        this.props.onChange(chooseChain.length > 0 ? chooseChain[chooseChain.length - 1] : null);
    }

    getListData = () => {
        const {collectionData, chooseChain} = this.state;
        let listData = collectionData;
        for (let i = 0; i < chooseChain.length; i++) {
            let chooseOne = chooseChain[i];
            listData = listData.find(o => o.id === chooseOne.id).items;
        }
        return listData;
    }

    render() {
        const {creating, collectionName, chooseChain} = this.state;
        const selectedCollection = chooseChain.length > 0 ? chooseChain[chooseChain.length - 1] : null;
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
                        + Create {chooseChain.length > 0 ? 'Folder' : 'Collection'}
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
                                addonAfter={collectionName && (YES_ICON(this.handleYesBtnClick))}
                                onPressEnter={this.handleYesBtnClick}
                                // onBlur={this.handleCreateBtnBlur}
                            />
                        </div>
                    )
                }

                <List
                    size="small"
                    // bordered
                    dataSource={this.getListData()}
                    renderItem={item => (
                        <List.Item 
                            key={item.id}
                            className={`collection-select-card-item ${chooseChain.length > 0 && !item.items ? 'collection-select-card-request-item' : 'collection-select-card-collection-item'}`}
                            actions={[
                                <CaretRightOutlined className="collection-select-card-item-right" />
                            ]}
                            onClick={() => this.handleListItemClick(item)}>
        
                            <div className="vertical-center">
                                {
                                    chooseChain.length === 0 || item.items ? COLLECTION_ICON_20 : (
                                        item.method === 'POST' ? POST_REQUEST_ICON : GET_REQUEST_ICON
                                    )
                                }
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

CollectionSelectCard.defaultProps = {
    onChange: () => {},
}







