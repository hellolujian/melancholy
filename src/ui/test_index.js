import React from 'react';
import { render } from 'react-dom';
import {List, PageHeader, Button, Upload, Col, Input, Typography, Table} from 'antd'
import { CaretLeftOutlined, SearchOutlined,} from '@ant-design/icons';

import Icon from '@ant-design/icons';


import TextareaAutosize from "react-autosize-textarea"

// import * as XLSX from 'xlsx';

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

//   onImportExcel = file => {

//     let data = [];// 存储获取到的数据

//     // 通过FileReader对象读取文件

//   const fileReader =new FileReader();

//   fileReader.readAsBinaryString(file);  //二进制

//   fileReader.onload = event => {

//  try {

//                 const {result } = event.target;

//             // 以二进制流方式读取得到整份excel表格对象

//               const workbook = XLSX.read(result, {type:'binary' });

//             // 遍历每张工作表进行读取（这里默认只读取第一张表）

//              for (const sheet in workbook.Sheets) {

//                 if (workbook.Sheets.hasOwnProperty(sheet)) {

//                     // 利用 sheet_to_json 方法将 excel 转成 json 数据

//                   data =data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));

//                 // break; // 如果只取第一张表，就取消注释这行

//     }

// }

// console.log(data);
// this.setState({excelData: data});

// }catch (e) {

// // 这里可以抛出文件类型错误不正确的相关提示

//   console.log('文件类型不正确');

//   return;

// }

// };

// }


  render() {

    const {excelData} = this.state;

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
//       <PageHeader
//       breadcrumbRender={() => (
// <Row>
//         <Col span={24}>
//           <Input style={{borderRadius:'20px'}} placeholder="Filter" prefix={<SearchOutlined />} />
//         </Col>
//       </Row>
//       )}
//       backIcon={<CaretLeftOutlined />}
//     onBack={() => null}
  
//     subTitle={<Typography.Link>api-new</Typography.Link>}
//     extra={[
//       <Button type="link">+ Create Folder</Button>
//     ]}
//   >

// <List
//       size="small"
//       // header={<div>Header</div>}
//       // footer={<div>Footer</div>}
//       bordered
//       dataSource={data}
//       renderItem={item => <List.Item>{item.name}</List.Item>}
//     />

//   </PageHeader>


<>


{/* <Upload name="excel" action="" listType="text"  accept=".xlsx,.xls" beforeUpload={this.onImportExcel} maxCount={1} >

    <Button>

        <Icon type="upload" />点击上传报表

    </Button>

    </Upload>

    {
      excelData && excelData.length > 0 && (
        <Table
          size="small"
          bordered
          dataSource={excelData}
          columns={Object.keys(excelData[0]).map(key => {return {dataIndex: key, title: key}})}
          pagination={false}
        />
      )
    } */}


<Table
          size="small"
          bordered
          dataSource={[{key: 'sdf', value: '1234', desc: 'sdfsd'}, {key: 'sdf', value: '1234', desc: 'sdfsd'}]}
          columns={[{dataIndex: 'key', title: 'KEY', render: (text, record, index) => {
            return (<TextareaAutosize
              placeholder='try writing some lines' 
            />)
          }}, {dataIndex: 'value', title: 'VALUE'}, {dataIndex: 'desc', title: 'DESC'}]}
          pagination={false}
        />


</>



    )

  }
}
export default Home;







