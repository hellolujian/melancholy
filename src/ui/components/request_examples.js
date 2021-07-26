import React from 'react';
import {Popover, Button, Space} from 'antd';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';

import {stopClickPropagation} from '@/utils/global_utils';
import { REQUEST_EXAMPLES_TIPS } from '@/ui/constants/tips'
class RequestExample extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    render() {
     
        let content = (
            <Space direction="vertical" size="large" className="full-width" style={{textAlign: 'center'}}>
            No examples added
            {REQUEST_EXAMPLES_TIPS}
            <Button type="primary">Add Example</Button>
            </Space>
        )
        return (
            <Popover placement="bottomRight" content={content} title="" overlayInnerStyle={{width: 350, padding: 20}}>
                <Button type="link" onClick={stopClickPropagation}>Examples(1)  <CaretDownOutlined /></Button>
            </Popover>
        )
    }
}

export default RequestExample;







