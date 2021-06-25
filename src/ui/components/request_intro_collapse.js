import React from 'react';
import { Collapse, Typography, Popover, Button   } from 'antd';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import '../style/common.css'
const { Panel } = Collapse;
const { Text } = Typography;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

class TooltipButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    render() {
     
      let header = (
        <Text editable={{ tooltip: false, onChange: this.setHideTooltipStr }} style={{display: 'inline-block'}}>
        水电费
      </Text>
      )
        return (
            <Collapse
    bordered={false}
    defaultActiveKey={['1']}
    expandIcon={({ isActive }) => <CaretRightOutlined />}
    // className="site-collapse-custom-collapse"
  >
    <Panel header={header} key="1" className="site-collapse-custom-panel" extra={<Popover content="" title="Title">
    <Button type="link">Examples(1)  <CaretDownOutlined /></Button>
  </Popover>}>
      <p>{text}</p>
    </Panel>
  
  </Collapse>
        )
    }
}

export default TooltipButton;







