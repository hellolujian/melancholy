import React from 'react';
import { render } from 'react-dom';
import {List, PageHeader, Button, Row, Col, Input, Typography} from 'antd'
import { CaretLeftOutlined, SearchOutlined,} from '@ant-design/icons';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...',
    }
  }
  editorDidMount(editor, monaco) {
    console.log('editorDidMount', editor);
    editor.focus();
  }
  onChange(newValue, e) {
    console.log('onChange', newValue, e);
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
    ];
    return (
      <PageHeader
      breadcrumbRender={() => (
<Row>
        <Col span={24}>
          <Input style={{borderRadius:'20px'}} placeholder="Filter" prefix={<SearchOutlined />} />
        </Col>
      </Row>
      )}
      backIcon={<CaretLeftOutlined />}
    onBack={() => null}
  
    subTitle={<Typography.Link>api-new</Typography.Link>}
    extra={[
      <Button type="link">+ Create Folder</Button>
    ]}
  >

<List
      size="small"
      // header={<div>Header</div>}
      // footer={<div>Footer</div>}
      bordered
      dataSource={data}
      renderItem={item => <List.Item>{item.name}</List.Item>}
    />

  </PageHeader>
    )

  }
}
export default Home;







