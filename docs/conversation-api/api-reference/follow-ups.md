---
id: follow-ups
title: GET Follow-Ups
sidebar_label: GET Follow-Ups
slug: /conversation-api/follow-ups/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

---

This API returns list of all the follow-ups generated from the conversation.

This is a category of [Action Items](/docs/conversation-api/action-items) with a connotation to follow-up a request or
a task like sending an email or making a phone call or booking an appointment
or setting up a meeting.

### Authentication

Before using the Conversation API, you must generate your authentication token (`AUTH_TOKEN`). To learn how to get the authentication token, see the [Authentication](/docs/developer-tools/authentication) page.

### HTTP Request

`GET https://api.symbl.ai/v1/conversations/{conversationId}/follow-ups`

### Example API Call

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

curl "https://api.symbl.ai/v1/conversations/$CONVERSATION_ID/follow-ups" \
    -H "Authorization: Bearer $AUTH_TOKEN"
```

</TabItem>

<TabItem value="nodejs">

```js
const request = require('request');
const authToken = AUTH_TOKEN;
const conversationId = CONVERSATION_ID;

request.get({
    url: `https://api.symbl.ai/v1/conversations/${conversationId}/follow-ups`,
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

baseUrl = "https://api.symbl.ai/v1/conversations/{conversationId}/follow-ups"
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
    print("followUps => " + str(response.json()['followUps']))  # followUps object containing followUp id, text, type, score, messageIds, entities, from, assignee, phrases
elif response.status_code in responses.keys():
    print(responses[response.status_code])  # Expected error occurred
else:
    print("Unexpected error occurred. Please contact support@symbl.ai" + ", Debug Message => " + str(response.text))

exit()
```
</TabItem>
</Tabs>


### Response

```json
{
    "followUps": [
        {
            "id": "4526427164639111",
            "text": "We need to have the meeting today, and we're going to talk about the how to run a product strategy workshop conducted by Richard Holmes yesterday evening. There is a meeting with the customer in the afternoon as well.",
            "type": "follow_up",
            "score": 0.8660254037851491,
            "messageIds": [
                "4675554024357888"
            ],
            "entities": [
                {
                    "type": "date",
                    "text": "today",
                    "offset": 28,
                    "value": "2020-06-22"
                },
                {
                    "type": "datetimerange",
                    "text": "yesterday evening",
                    "offset": 67,
                    "start": "2020-06-21 16:00:00",
                    "end": "2020-06-21 20:00:00" 
                },
                {
                    "type": "timerange",
                    "text": "afternoon",
                    "offset": 34,
                    "start": "12:00:00",
                    "end": "15:00:00" 
                },
                {
                    "type": "person",
                    "text": "Richard Holmes",
                    "offset": 110,
                    "value": {
                        "name": "Richard Holmes"
                    }
                }
            ],
            "definitive": true,
            "from": {
                "id": "e2219a6c-ec5e-4412-94d7-46f565ba5eb7",
                "name": "John",
                "userId": "John@example.com"
            },
            "assignee": {
                "id": "e2219a6c-ec5e-4412-94d7-46f565ba5eb7",
                "name": "Jane",
                "email": "Jane@example.com"
            },
            "dueBy": "2020-06-22T07:00:00.000Z"
        }
    ]
}
```


### Response Object

Field  | Description
---------- | ------- |
```id``` | Unique conversation identifier.
```text``` | Conversation text.
```type``` | Response type. Default is `follow_up`.
```score``` | Confidence score of the generated topic. Value from 0 - 1.
```messageIds``` | Unique message identifiers of the corresponding messages.
```entities``` | List of detected entity objects in the insight with `type` - entity type and `text` - corresponding text.
```definitive``` | Boolean indicating if the follow-up is definitive or not.
```from``` | User object with proprities `name` and `email`.
```assignee``` | This field contains the name and email of the person assigned to the follow-up.
```phrases``` | List of detected phrases with `type` - phrase type and `text` - corresponding text. The `action_phrase` type represents the actionable part of an insight.
