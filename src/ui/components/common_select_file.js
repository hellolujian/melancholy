import React from 'react';
import {Tooltip, Button, Typography, Popover} from 'antd';
import {getValueByVariableType} from '@/utils/global_utils'

const {Link} = Typography;
class CommonSelectFile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
      
    }

    handleSelectBtnClick = async () => {
        const {directory, file, multiple, title, defaultPath, mode = 'select'} = this.props;
        let realDefaultPath = await getValueByVariableType(defaultPath);
        const openFileSelect = window.require('@electron/remote').getGlobal(mode === 'select' ? 'OPEN_FILES_ELECT_DIALOG' : 'SHOW_SAVE_DIALOG');
        let selectedFiles = openFileSelect({multiple: multiple, file: file, directory: directory, title: title, defaultPath: realDefaultPath});
        console.log(selectedFiles);
        this.props.onSelect(!multiple && selectedFiles && Array.isArray(selectedFiles) && selectedFiles.length > 0 ? selectedFiles[0] : selectedFiles);
    }

    render() {
        const {buttonProps = {}, label, value = [], tooltipProps} = this.props;
        // let realValue = Array.isArray(value) ? value : [value];
        
        let selectButton = (
            <Button {...buttonProps} onClick={this.handleSelectBtnClick}>
                {label}
            </Button>
        )
        return tooltipProps ? (
            <Tooltip {...tooltipProps}>
                {selectButton}
            </Tooltip>
        ) : selectButton

            

            // <Popover 
            //     overlayStyle={{maxWidth: 600}}
            //     content={realValue.length > 0 ? realValue.join(', \r\n') : 'No file selected'} 
            // >

            
           
                
            // </Popover>
            
        
    }
}

export default CommonSelectFile;

CommonSelectFile.defaultProps = {
    onSelect: () => {},
}







