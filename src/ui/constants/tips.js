import {Typography} from 'antd';

const { Text, Link } = Typography;

const VARIABLES_VALUE_URL = 'https://learning.postman.com/docs/sending-requests/variables/#sharing-and-persisting-data';

const VARIABLES_URL = 'https://learning.postman.com/docs/sending-requests/variables/';

const VARIABLE_TIPS = (
    <Text>These variables are specific to this collection and its requests.
        <Link href={VARIABLES_URL}> Learn more about collection variables.</Link>
    </Text>
)

// 变量值tips
const VARIABLE_VALUE_TIPS = (
    <Text>
        Use variables to reuse values in different places. The current value is used while sending a request and is never synced to Postman's servers. The initial value is auto-updated to reflect the current value. 
        <Link href=""> Change this</Link> behaviour from Settings. <Link href={VARIABLES_VALUE_URL}>Learn more about variable values</Link>
    </Text>
)

const COLLECTION_DESCRIPTION_TIPS = (
    <Text>This description will show in your collection’s documentation, along with the descriptions of its folders and requests.</Text>
)

const DESCRIPTION_TIPS = 'Make things easier for your teammates with a complete request description. ';

const DESCRIPTION_MARKDOWN_TIPS = (
    <Text>Descriptions support <Link href="https://learning.postman.com/docs/collaborating-in-postman/commenting-on-collections/" target="_blank">Markdown</Link></Text>
)

const AUTHORIZATION_TIPS = (
    <Text>This authorization method will be used for every request in this collection. You can override this by specifying one in the request.</Text>
)

const PRE_REQUEST_SCRIPTS_TIPS = (
    <Text>This script will execute before every request in this collection. <Link href="https://learning.postman.com/docs/writing-scripts/pre-request-scripts/" target="_blank">Learn more about Postman’s execution order.</Link></Text>
)

const TESTS_TIPS = (
    <Text>These tests will execute after every request in this collection. <Link href="https://learning.postman.com/docs/writing-scripts/test-scripts/" target="_blank">Learn more about Postman’s execution order.</Link></Text>
                        
)
export { 
    VARIABLE_TIPS,
    VARIABLE_VALUE_TIPS,
    COLLECTION_DESCRIPTION_TIPS,
    DESCRIPTION_TIPS,
    DESCRIPTION_MARKDOWN_TIPS,
    AUTHORIZATION_TIPS,
    PRE_REQUEST_SCRIPTS_TIPS,
    TESTS_TIPS
}