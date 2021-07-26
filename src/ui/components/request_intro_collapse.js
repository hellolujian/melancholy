import React from 'react';
import { Collapse, Typography, Popover, Button   } from 'antd';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import DescriptionEditor from 'ui/components/description_editor'

import { EDIT_ICON } from '@/ui/constants/icons'
import RequiredInput from './required_input'
import RequestExamples from './request_examples'
import '../style/common.css'
import 'ui/style/request_intro_collapse.css'
const { Panel } = Collapse;
const { Text,Title } = Typography;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

class RequestIntro extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    render() {
     
      const {showEditInput} = this.state;
      let header = (
      
        <RequiredInput 
        // onBlur={this.saveCollectionName}
        // onPressEnter={this.saveCollectionName}
        size="small"
        editIcon={{className: "request-intro-edit-icon"}}
        defaultValue="hello"
        // onClick={stopClickPropagation} 
    />
                                        
       
        
      )
        return (
            <Collapse
              bordered={false}
              // defaultActiveKey={['1']}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              // className="site-collapse-custom-collapse"
            >
              <Panel 
                header={header} 
                className="site-collapse-custom-collapse-panel"
                key="1" 
                extra={<RequestExamples />}>
               
                <DescriptionEditor />
              </Panel>
            
            </Collapse>
        )
    }
}

export default RequestIntro;







