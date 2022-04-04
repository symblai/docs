---
id: questions
title: Questions
sidebar_label: Questions
slug: /concepts/questions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Any explicit question or request for information that comes up during the conversation, whether answered or not, is recognized as a question.

#### Examples

- *“What features are most relevant for our use case?”*
- *“How are we planning to design the systems?”*

## Key Features 

- Recognition of questions pointed to someone.
- Recognition of implicit questions.
- Recognition of questions that are actionable in nature.
- Ignoring chit chats - which are questions in nature but part of casual small- talks.

## Questions API

To see the Questions API in action, you need to process a conversation using Symbl. After you process a meeting, you'll receive a **Conversation ID** which is passed in Conversation API. A Conversation ID is the key to receiving conversational insights from any conversation. As an example, here's a simple API call which grabs the detected questions from the conversation.

👉 [Questions API](/docs/conversation-api/questions)

### Grab Questions 

Remember to replace the `conversationId` in the API call with the Conversation ID you get from the previous API call.


<Tabs
  defaultValue="cURL"
  values={[
    { label: 'cURL', value: 'cURL', },
    { label: 'Node.js', value: 'nodejs', },
    { label: 'Python', value: 'python' }
  ]
}>
<TabItem value="cURL">

```shell
curl "https://api.symbl.ai/v1/conversations/$CONVERSATION_ID/questions" \
    -H "Authorization: Bearer $AUTH_TOKEN"
```
</TabItem>

<TabItem value="nodejs">

```js
const request = require('request');
const authToken = AUTH_TOKEN;
const conversationId = CONVERSATION_ID;

request.get({
    url: `https://api.symbl.ai/v1/conversations/${conversationId}/questions`,
    headers: { 'Authorization': `Bearer ${authToken}` },
    json: true
}, (err, response, body) => {
    console.log(body);
});
```

</TabItem>
<TabItem value="python">

```py
import requests

baseUrl = "https://api.symbl.ai/v1/conversations/{conversationId}/questions"
conversationId = 'your_conversation_id'  # Generated using Submit text end point

url = baseUrl.format(conversationId=conversationId)

# set your access token here. See https://docs.symbl.ai/docs/developer-tools/authentication
access_token = 'your_access_token'

headers = {
    'Authorization': 'Bearer ' + access_token,
    'Content-Type': 'application/json'
}

responses = {
    401: 'Unauthorized. Please generate a new access token.',
    404: 'The conversation and/or it\'s metadata you asked could not be found, please check the input provided',
    500: 'Something went wrong! Please contact support@symbl.ai'
}

response = requests.request("GET", url, headers=headers)

if response.status_code == 200:
    # Successful API execution
    print("questions => " + str(response.json()['questions']))  # questions object containing question id, text, type, score, messageIds,entities
elif response.status_code in responses.keys():
    print(responses[response.status_code])  # Expected error occurred
else:
    print("Unexpected error occurred. Please contact support@symbl.ai" + ", Debug Message => " + str(response.text))

exit()
```

</TabItem>
</Tabs>
