import {Typography} from 'antd';

const { Text, Link, Paragraph } = Typography;

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

const GLOBAL_TEXT_TIPS = (
    <Text>Global variables are a set of variables that are always available in a workspace.</Text>
)

const ENVIRONMENT_LINK_TIPS = (
    <Link href="https://learning.postman.com/docs/sending-requests/managing-environments/">Learn more about environments</Link>
)

const GLOBAL_LINK_TIPS = (
    <Link href="https://learning.postman.com/docs/sending-requests/variables/">Learn more about globals</Link>
)

const ENVIRONMENT_TIPS = (
    <Text>
        An environment is a set of variables that allow you to switch the context of your requests. Environments can be shared between multiple workspaces. {ENVIRONMENT_LINK_TIPS}
    </Text>
)

const GLOBALS_LEARN_MORE_TIPS = (
    <Link href="https://learning.postman.com/docs/sending-requests/variables/">Learn more about globals</Link>
)

const GLOBALS_TIPS = (
    <Text>
        Global variables for a workspace are a set of variables that are always available within the scope of that workspace. They can be viewed and edited by anyone in that workspace. {GLOBALS_LEARN_MORE_TIPS}
    </Text>
)
const ENVIRONMENT_EXT_TIPS = (
    <Text>
        You can declare a variable in an environment and give it a starting value, then use it in a request by putting the variable name within curly-braces.
    </Text>
)

const NO_ENVIRONMENT_VARIABLES_TIPS = (
    <Text strong>No Environment variables</Text>
)

const NO_ENVIRONMENT_TIPS = (
    <Text strong>No active variables</Text>
)

const NO_GLOBAL_VARIABLES_TIPS = (
    <Text strong>No global variables</Text>
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

const TEST_SCRIPTS_CODE_TIPS = (
    <Text>Test scripts are written in JavaScript, and are run after the response is received. <div><Link href="https://learning.postman.com/docs/writing-scripts/test-scripts/">Learn more about tests scripts</Link></div></Text>
)

const AUTH_LEARN_TIPS = (
    <Link href="https://learning.postman.com/docs/sending-requests/authorization/">Learn more about authorization</Link>
)

const NO_AUTH_TIPS = (position) => (
    <Text>This {position} does not use any authorization. {AUTH_LEARN_TIPS}</Text>
)

const HAVE_AUTH_TIPS = (
    <Text type="secondary ">The authorization header will be automatically generated when you send the request. {AUTH_LEARN_TIPS}</Text>
)

const POSTMAN_DOCS_TIPS = (
    <Link href="https://learning.postman.com/docs/getting-started/introduction/">Learn more on Postman Docs</Link>
)

const SAVE_REQUEST_TIPS = (
    <Text>
        Requests in Postman are saved in collections (a group of requests). <br />
        <Link href="https://learning.postman.com/docs/sending-requests/intro-to-collections/">Learn more about creating collections</Link>
    </Text>
)

const INITIAL_VALUE_TIPS = "This value is shared with your team when you share the variable in a collection, environment or globals." ;

const CURRENT_VALUE_TIPS = "This value is used while sending a request. Current values are never synced to Postman's servers. If left untouched, the current value automatically assumes the initial value." ;

const PERSIST_ALL_TIPS = "Persisting all values will replace all initial values with the current values of the variables." ;

const RESET_ALL_TIPS = "Resetting all values will replace all current values with the initial values of the variables." ;

const DOCUMENTATION_DESC_TIPS = <Text type="secondary">Add a general description for your requests, eg. overview and authentication details. </Text>

const DOCUMENTATION_DESC_MARKDOWN_TIPS = (
    <Text type="secondary">
        You can use <Link href="https://learning.postman.com/docs/collaborating-in-postman/commenting-on-collections/">markdowon</Link> for adding headings, lists, code snippets etc. in your description.
    </Text>
)

const DOCUMENTATION_NAME_TIPS = (
    <Text type="secondary">
        Enter a title to describe your requests. This will help you identify your documentation and API collection in Postman.
    </Text>
)

const IMPORT_FILE_TIPS = (
    <Paragraph>
        Import a Postman Collection, Environment, data dump, curl command, or a RAML / WADL / Open API (1.0/2.0/3.0) / Runscope file.
    </Paragraph>
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
    PRE_REQUEST_SCRIPTS_CODE_TIPS,
    TEST_SCRIPTS_CODE_TIPS,
    NO_AUTH_TIPS, 
    POSTMAN_DOCS_TIPS,
    HAVE_AUTH_TIPS,
    SAVE_REQUEST_TIPS,
    INITIAL_VALUE_TIPS,
    CURRENT_VALUE_TIPS,
    PERSIST_ALL_TIPS,
    RESET_ALL_TIPS,
    DOCUMENTATION_DESC_TIPS,
    DOCUMENTATION_DESC_MARKDOWN_TIPS,
    DOCUMENTATION_NAME_TIPS,
    ENVIRONMENT_EXT_TIPS,
    GLOBALS_TIPS,
    NO_ENVIRONMENT_TIPS,
    NO_GLOBAL_VARIABLES_TIPS,
    GLOBAL_TEXT_TIPS,
    GLOBAL_LINK_TIPS,
    IMPORT_FILE_TIPS

}