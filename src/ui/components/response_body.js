import React from 'react';
import {Space, Button, Select, Tooltip, } from 'antd';
import { EyeOutlined, CaretDownOutlined  } from '@ant-design/icons';
import TooltipButton from './tooltip_button';
import {WRAP_ICON} from 'ui/constants/icons'


// import Editor from 'dt-react-monaco-editor'
const { Option } = Select;
class ResponseBody extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            prettyFormat: 'json'
        }
    }

    componentDidMount() {
      
    }

    render() {
     
        const {label, type, buttonProps = {}, tooltipProps = {}, title, icon, shape, size, onClick} = this.props;
      
        const {prettyFormat} = this.state;
        const prettyFormatOptions = [
            {
                label: 'JSON', value: 'json'
            },
            {
                label: 'XML', value: 'xml'
            },
            {
                label: 'HTML', value: 'html'
            },
            {
                label: 'Text', value: 'text'
            },
            {
                label: 'Auto', value: 'auto', 
            } 
        ]
        return (
            <Space direction="vertical" className="full-width">
                <Space>
                <span>
                    <Button type="text" className="postman-button-class">
                        Pretty
                    </Button>
                    <Button type="text" className="postman-button-class">
                        Raw
                    </Button>
                    <Button type="text" className="postman-button-class">
                        Preview
                    </Button>
                </span>
                <Select 
                    options={prettyFormatOptions} 
                    suffixIcon={<CaretDownOutlined />}
                    // style={{ width: 120 }} 
                    value={prettyFormat}
                    onChange={this.handleChange} 
                />
                <TooltipButton title="Wrap Line" buttonProps={{icon: WRAP_ICON, type: 'text', className: 'postman-button-class'}} /> 
            </Space>

                {/* <Editor
                    value='// 初始注释'
                    language="json"
                    options={{ readOnly: false }}
                /> */}
            </Space>
                        
        )
    }
}

export default ResponseBody;







