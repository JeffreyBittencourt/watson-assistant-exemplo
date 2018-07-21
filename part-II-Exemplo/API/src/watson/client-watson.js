const AssistantV1 = require('watson-developer-cloud/assistant/v1');

const watsonAssistant = new AssistantV1({
    version: '2018-07-10',
    username: '9c0d9a22-4922-422b-a348-860dcf95eb5c',
    password: '3r1VpowUNvyG',
    url: 'https://gateway.watsonplatform.net/assistant/api'
});

module.exports = watsonAssistant;