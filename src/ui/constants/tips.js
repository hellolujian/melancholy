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

const ENVIRONMENT_TEXT_TIPS = (
    <Text>An environment is a set of variables that allow you to switch the context of your requests.</Text>
)
const ENVIRONMENT_LINK_TIPS = (
    <Link>Learn more about environments</Link>
)
const ENVIRONMENT_TIPS = (
    <Text>
        An environment is a set of variables that allow you to switch the context of your requests. Environments can be shared between multiple workspaces. {ENVIRONMENT_LINK_TIPS}
    </Text>
)

const NO_ENVIRONMENT_VARIABLES_TIPS = (
    <Text strong>No Environment variables</Text>
)

const COOKIE_LEARN_MORE_TIPS = (
    <Link href="https://learning.postman.com/docs/sending-requests/cookies/">Learn More</Link>
)

const REQUEST_EXAMPLES_TIPS = (
    <Text>Save responses and associated requests as Examples. <Link href="https://blog.postman.com/mock-responses-in-postman-by-using-examples/">Learn More</Link></Text>
)

const PRE_REQUEST_SCRIPTS_CODE_TIPS = (
    <Text>Pre-request scripts are written in JavaScript, and are run before the request is sent. <Link href="https://learning.postman.com/docs/writing-scripts/pre-request-scripts/">Learn more about pre-request scripts</Link></Text>
)
export { 
    VARIABLE_TIPS,
    VARIABLE_VALUE_TIPS,
    COLLECTION_DESCRIPTION_TIPS,
    DESCRIPTION_TIPS,
    DESCRIPTION_MARKDOWN_TIPS,
    AUTHORIZATION_TIPS,
    PRE_REQUEST_SCRIPTS_TIPS,
    TESTS_TIPS,
    ENVIRONMENT_LINK_TIPS,
    ENVIRONMENT_TEXT_TIPS,
    ENVIRONMENT_TIPS,
    NO_ENVIRONMENT_VARIABLES_TIPS,
    COOKIE_LEARN_MORE_TIPS,
    REQUEST_EXAMPLES_TIPS,
    PRE_REQUEST_SCRIPTS_CODE_TIPS
}