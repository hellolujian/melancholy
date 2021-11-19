import React from 'react';
import {Space, Button, Input, Row, Col, Typography, Collapse, Empty, Select, Dropdown, Menu, Cascader, message  } from 'antd';

import CodeGen from 'postman-code-generators';
import PostmanSDK from 'postman-collection'
import ButtonModal from './button_modal'

import TooltipButton from './tooltip_button'
import CookieItem from './cookie_item'
import {CLOSE_SVG} from '@/ui/constants/icons'
import Icon from '@ant-design/icons';
import {
    COOKIE_LEARN_MORE_TIPS
} from 'ui/constants/tips'

import ScriptEditor from './script_editor'

import { 
    UserOutlined, CaretDownFilled, PlusSquareFilled,SyncOutlined,
    ReadOutlined, ToolFilled ,NotificationFilled , EnvironmentFilled ,
    FolderViewOutlined ,DatabaseOutlined  , PullRequestOutlined  
} from '@ant-design/icons';
import {stopClickPropagation} from '@/utils/global_utils';
import {updateDomainMeta, queryDomainMetaById, insertDomainMeta, queryDomainMeta} from '@/database/domain_meta'
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {UUID} from '@/utils/global_utils'
const { Panel } = Collapse;
const { Option } = Select;
const { SubMenu } = Menu;
class CodeModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    getGenerateCode = (value) => {
        console.log(value);
        let supportedCodegens = CodeGen.getLanguageList();
        // TODO: fix request
        let request = new PostmanSDK.Request('https://www.google.com'),  //using postman sdk to create request 
            targetLan = value ? supportedCodegens.find(lan => lan.key === value[0]) : supportedCodegens[0],
            language = targetLan.key,
            variant = targetLan.variants.length > 1 ? targetLan.variants.find(variant => variant.key === value[1]).key : targetLan.variants[0].key,
            options = {
                indentCount: 4,
                indentType: 'Space',
                trimRequestBody: true,
                followRedirect: true
            };

        let codeMode = 'text';
        switch (language) {
            case 'csharp': codeMode = 'csharp'; break;
            case 'curl': codeMode = 'curly'; break;
            case 'dart': codeMode = 'dart'; break;
            case 'go': codeMode = 'golang'; break;
            case 'http': codeMode = 'text'; break;
            case 'java': codeMode = 'java'; break;
            case 'javascript': codeMode = 'javascript'; break;
            case 'c': codeMode = 'c_cpp'; break;
            case 'nodejs': codeMode = 'javascript'; break;
            case 'objective-c': codeMode = 'objectivec'; break;
            case 'ocaml': codeMode = 'ocaml'; break;
            case 'php': codeMode = 'php'; break;
            case 'powershell': codeMode = 'powershell'; break;
            case 'python': codeMode = 'python'; break;
            case 'ruby': codeMode = 'ruby'; break;
            case 'shell': codeMode = 'sh'; break;
            case 'swift': codeMode = 'swift'; break;
            default: break;
        }
        CodeGen.convert(language, variant, request, options, (error, snippet) => {
            if (error) {
                //  handle error
            }
            this.setState({generateCode: snippet, codeMode: codeMode})
        });
    }

    componentDidMount() {
        // let supportedCodegens = CodeGen.getLanguageList();
        // console.log(supportedCodegens);
        this.getGenerateCode()
    }

    handleCascaderChange = (value, selectedOptions) => {
        this.getGenerateCode(value)
    }

    handleCopy = (text, result) => {
        if (result) {
            message.success('successful')
        } else {
            message.error("error")
        }
    }

    handleCodeChange = (value) => {
        this.setState({generateCode: value});
    }
 
    render() {

        let {domainName, domains, menuKeyLabel = 'HTTP', codeMode = '', snippets, generateCode} = this.state;

        return (
            <ButtonModal  
                    label="Code"
                    // modalVisible={true}
                    buttonProps={{
                        type: 'link'
                    }}
                    modalProps={{
                        title: 'GENERATE CODE SNIPPETS',
                        width: 700,
                        bodyStyle: { height:450, overflowY: 'auto'},
                    }}
                    modalContent={
                        <Space direction="vertical" className="full-width">
                            <Space className="justify-content-space-between full-width">
                                <Cascader 
                                    allowClear={false}
                                    expandTrigger="hover"
                                    defaultValue={[CodeGen.getLanguageList()[0].key]}
                                    options={CodeGen.getLanguageList().map(lan => {
                                        const {key, label, variants} = lan;
                                        let option = {
                                            value: key,
                                            label: label
                                        }
                                        if (variants.length > 1) {
                                            option.children = variants.map(variant => {
                                                return {
                                                    value: variant.key,
                                                    label: variant.key
                                                }
                                            })
                                        }
                                        return option
                                    })} 
                                    onChange={this.handleCascaderChange} 
                                    placeholder="Please select" 
                                />
                                <CopyToClipboard 
                                    text={generateCode} 
                                    onCopy={this.handleCopy}>
                                    <Button type="primary">
                                        Copy to Clipboard
                                    </Button>
                                </CopyToClipboard>
                            </Space>

                            <ScriptEditor 
                                value={generateCode}
                                mode={codeMode}
                                onChange={this.handleCodeChange}
                            />
                        </Space>
                    }
                />
        )
    }
}

export default CodeModal;







