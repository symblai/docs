---
id: create-tracker
title: Create Trackers 
sidebar_label: POST Tracker
slug: /management-api/trackers/create-tracker
---

---
:::note In Beta Phase
This feature is in the Beta phase. If you have any questions, ideas or suggestions please reach out to us at devrelations@symbl.ai.
:::

The endpoints given below creates a Tracker entity which can be consumed in Symbl APIs. 

Currently, the Tracker entities can be consumed in the [Async APIs](/docs/async-api/code-snippets/track-phrases-in-a-conversation) and [Streaming APIs](/docs/streamingapi/code-snippets/detect-key-phrases) only. Telephony API does not have support for Trackers yet.

You can create Trackers in the following ways:

- [Using Tracker Management API](#create-trackers-using-tracker-management-api)
- [Using Async APIs](#create-trackers-using-async-apis)
- [Using Streaming API](#create-trackers-using-streaming-api)

:::info Trackers Management UI
You can create, view, edit and delete Trackers via the Trackers Management UI as well. To access this feature, log in to the[Symbl Platform](https://platform.symbl.ai/#/login)
:::

You can also add several Trackers at the same time as a bulk operation. To learn how, see [**Bulk Create Trackers**](#create-trackers-in-bulk) section. 

:::info Create Trackers with Management API
While you can create Trackers with Async or Streaming APIs, it is recommended that you create Trackers using Management API because Trackers created with Management APIs are saved and can be reused while the same is not possible with Async or Streaming APIs. 
:::

## Create Trackers using Tracker Management API

---

The API given below creates a Tracker using the Management API. 

### API Endpoint

**<font color="orange">POST</font> `https://api.symbl.ai/v1/manage/tracker`**

### Request Headers

Header Name  | Required | Description
---------- | ------- |  ------- |
```Authorization``` | Mandatory | `Bearer <token>` The token you get from our [authentication process](/docs/developer-tools/authentication).
```Content-Type	``` | Mandatory | `application/json`
```x-api-key``` | Optional | DEPRECATED. The JWT token you get from our [authentication process](/docs/developer-tools/authentication).

:::info
For better tracking use prominent keywords and phrases along with few longer utterances which represent the Tracker.
:::

:::note Using Punctuations in Trackers Vocabulary 
You can only pass the following punctuations in trackers vocabulary:
- Periods `.` 
- Apostrophes `'` 

Using any other punctuation mark such as `?`, `,`, `!`, `:` is not allowed. 
:::

### Request Body

```javascript
{
    "name": "Promotion Mention",
    "vocabulary": [
       "We have a special promotion going on if you book this before",
       "I can offer you a discount of 10 20 percent you being a new customer for us",
       "We have our month special this month",
       "We have a sale right now on"
    ]
}
```
### Request Body Parameters

Parameter  | Description
---------- | -------
```name```| This member specifies a uniquely identifiable name given to the group/set of phrases defined by the `vocabulary` member. It is case-sensitive which means that a Tracker can be created with the same name but with different cases.
```vocabulary```| It specifies the set of phrases or keywords that need to be tracked in a conversation. Note that the Trackers API finds the matches for the given vocabulary throughout a conversation. For example, the Tracker Voice Message shown above can be used for detecting if the entire conversation is itself an automated reply or contains “contextually similar” phrases in it.

:::caution
Note that the vocabulary cannot have duplicate phrases/keywords.
:::

:::info
This API accepts a request body size up to 1MB. Request bodies exceeding this limit will result in the error `413 - Request Entity Too Large error being returned in the response`.
:::

### Response

```javascript
{
	"tracker": {
		"id": "4476908732794496",
		"name": "Promotion Mention",
		"vocabulary": [
			"We have a special promotion going on if you book this before",
            "I can offer you a discount of 10 20 percent you being a new customer for us",
            "We have our month special this month",
            "We have a sale right now on"
		]
	}
}
```
#### `tracker`

This is the wrapper JSON Object which additionally also contains a unique `id`associated with the Tracker entity that can be later used to instruct Symbl APIs to enhance that specific request with this Tracker for tracking keywords/phrases in a conversation.

:::info
This API has a maximum concurrency of 1 request. If you wish to create multiple trackers in a single API call, go to [Create Trackers in Bulk](#bulk-create-trackers) section.
:::

### Error Codes
In case of unsuccessful responses, the following error codes will be returned from the API:

Error Code  | Description | Resolution
---------- | ------- | -------
`409 - Conflict` | The 409 response code specifies that the Tracker with that specific name already exists. | Modify the name of the Tracker or Update the name of the existing Tracker with that name to resolve the error.
`429 - Too many requests` | The 429 response code specifies that the number of concurrent requests surpassed the limit for the API (which is 1 API call at a time). | Ensure that your system doesn’t make concurrent API calls that exceed this maximum limit.
`400 - Bad Request` | The 400 response code specifies that the request body or the parameters have incorrect key names or their values have types that are different than the ones expected. | Please read the message returned in the response to fix this error.
`413 - Request Entity Too Large` | The 413 response code specifies that the size of the request body exceeds that of the maximum limit the API supports (which is 1MB). | Please ensure that the size of the request body is under this limit to resolve this error.
`500 - Internal Server Error` | The 500 response code specifies that the server failed to handle the request. | Please reach out to support@symbl.ai if it persists after multiple attempts.
`502 - Bad Gateway` | The 502 response code specifies that the server failed to acknowledge the request. | This may happen due to multiple reasons. Please reach out to support@symbl.ai if it persists after multiple attempts.
`504 - Gateway Timeout` | The 504 response code specifies that the server failed to respond within the timeout duration. | Please reach out to support@symbl.ai if it persists after multiple attempts.

## Create Trackers in Bulk
---

This API allows you to create all the trackers to be sent in one array. This helps you perform bulk operations to create Trackers.

### API Endpoint 
**<font color="orange">POST</font> `https://api.symbl.ai/v1/manage/trackers`**

### Request Headers

Header Name  | Required | Description
---------- | ------- |  ------- |
```Authorization``` | Mandatory | `Bearer <token>` The token you get from our [authentication process](/docs/developer-tools/authentication).
```Content-Type	``` | Mandatory | `application/json`
```x-api-key``` | Optional | DEPRECATED. The JWT token you get from our [authentication process](/docs/developer-tools/authentication).

### Request Body

```javascript
[{
	"name": "Voice Message",
	"vocabulary": [
		"At the tone please record",
		"Please leave message after tone",
		"Call back during normal office hours",
		"If you are calling about an emergency",
		"Our offices are currently closed",
		"Our repesentatives are unavailable at this time",
		"Please leave message",
		"start recording message",
		"Begin recording message",
		"sending you to his voicemail",
		"Leave Name and contact info",
		"Leave name and number",
		"I can call after",
		"Leave message with name",
		"leave message with number",
		"press to listen",
		"press to record",
		"press to send",
		"Record your message",
		"Return call ASAP",
		"return your call as soon as possible",
		"get back soon",
		"get back as quickly as possible",
		"Sorry we missed your call",
		"sorry we missed you",
		"You have reached office"
	]
}]
```
:::info
The request body is essentially an array of tracker entities, each of which will be created separately in Symbl’s backend.
:::

### Request Parameters

Parameter | Description | 
---------- | -------
`name` | The `name` acts as a unique identifier assigned to the Tracker. It is case-sensitive which means that a Tracker can be created with the same name but with different cases.
`vocabulary` | The vocabulary contains a set of phrases/keywords which signify the context of the Tracker. In other words, these are a set of sentences that are commonly used while talking about the said Tracker in different contexts. 

:::caution
The vocabulary cannot have duplicate phrases/keywords.
:::

:::info
This API accepts a request body up to 1MB size. Request bodies exceeding this limit will result in the error: `413 - Request Entity Too Large error`.&nbsp;&nbsp;

If you need to create Tracker entity(s) greater than this size, consider splitting it into multiple Tracker entities with the vocabulary of the Tracker split across these instances.
:::

### Response

```javascript
{
	"trackers": [{
		"id": "7476908732794496",
		"name": "Voice Message",
		"vocabulary": [
			"At the tone please record",
			"Please leave message after tone",
			"Call back during normal office hours",
			"If you are calling about an emergency",
			"Our offices are currently closed",
			"Our repesentatives are unavailable at this time",
			"Please leave message",
			"start recording message",
			"Begin recording message",
			"sending you to his voicemail",
			"Leave Name and contact info",
			"Leave name and number",
			"I can call after",
			"Leave message with name",
			"leave message with number",
			"press to listen",
			"press to record",
			"press to send",
			"Record your message",
			"Return call ASAP",
			"return your call as soon as possible",
			"get back soon",
			"get back as quickly as possible",
			"Sorry we missed your call",
			"sorry we missed you",
			"You have reached office"
		]
	}]
}
```
#### `trackers`
The `trackers` is the wrapper JSON Array which contains all the Tracker entities created.&nbsp;&nbsp;

It also contains a unique `id` associated with the Tracker entity that can be later used to instruct Symbl's APIs to enhance that specific request with this Tracker for tracking the keywords/phrases.

:::info
This API has a maximum concurrency of 1 request.
:::

### Error Codes
In case of unsuccessful responses, the following error codes will be returned from the API:

Error Code  | Description | Resolution
---------- | ------- | -------
`409 - Conflict` | The 409 response code specifies that the Tracker with that specific name already exists. | Modify the name of the Tracker or Update the name of the existing Tracker with that name to resolve the error.
`429 - Too many requests` | The 429 response code specifies that the number of concurrent requests surpassed the limit for the API (which is 1 API call at a time). | Ensure that your system doesn’t make concurrent API calls that exceed this limit.
`400 - Bad Request` | The 400 response code specifies that the request body or the parameters have incorrect key names or their values have types that are different than the ones expected. | Please read the message returned in the response to fix this error.
`413 - Request Entity Too Large` | The 413 response code specifies that the size of the request body exceeds that of the maximum limit the API supports (which is 1 MB). | Please ensure that the size of the request body is under this limit to resolve this error.
`500 - Internal Server Error` | The 500 response code specifies that the server failed to handle the request. | Please reach out to support@symbl.ai if it persists after multiple attempts.
`502 - Bad Gateway` | The 502 response code specifies that the server failed to acknowledge the request. This may happen due to multiple reasons. | Please reach out to support@symbl.ai if it persists after multiple attempts.
`504 - Gateway Timeout` | The 504 response code specifies that the server failed to respond within the timeout duration. | Please reach out to support@symbl.ai if it persists after multiple attempts. 


## Create Trackers using Async APIs
---

Symbl provides a diverse set of Async APIs based on Audio/Video or Textual content. For more details on Async APIs refer to the documentation [here](/docs/async-api/introduction). 

The Trackers once ingested via the request, will then try to detect these in the Conversation. Once the job is complete, you can fetch the Trackers from the Conversation API through the `/trackers` endpoint described below.

### Async Audio File API
The Tracker entities should be passed in as a **query parameter** in the Async Audio API’s URL like shown below

### API Endpoint

```json
"https"://api.symbl.ai/v1/process/audio?trackers=[
   {
      "name":"COVID-19",
      "vocabulary":[
         "social distancing",
         "cover your face with mask",
         "vaccination"
      ]
   }
]
```
### Request Headers

Header Name  | Required | Description
---------- | ------- |  ------- |
```Authorization``` | Mandatory | `Bearer <token>` The token you get from our [authentication process](/docs/developer-tools/authentication).
```Content-Type	``` | Optional | `application/json` This header must contain the MIME Type of the audio file’s container.
```x-api-key``` | Optional | DEPRECATED. The JWT token you get from our [authentication process](/docs/developer-tools/authentication).

## Async Audio URL API

The Tracker entities should be passed in as a member of the **request body** of the Async Audio URL API like shown below:

### API Endpoint

**<font color="orange">POST</font> `https://api.symbl.ai/v1/process/audio/url`**

### Request Header

Header Name  | Required | Description
---------- | ------- |  ------- |
```Authorization``` | Mandatory | `Bearer <token>` The token you get from our [authentication process](/docs/developer-tools/authentication).
```Content-Type	``` | Mandatory | `application/json` This header must contain the MIME Type of the audio file’s container.
```x-api-key``` | Optional | DEPRECATED. The JWT token you get from our [authentication process](/docs/developer-tools/authentication).


### Request Body

```json
{
    "url": "<PUBLIC_AUDIO_FILE_URL>",
    "confidenceThreshold": 0.6,
    "timezoneOffset": 0,
    "trackers": [
        {
            "name": "Promotion Mention",
            "vocabulary": [
                "We have a special promotion going on if you book this before",
                "I can offer you a discount of 10 20 percent you being a new customer for us",
                "We have our month special this month",
                "We have a sale right now on"
            ]
        }
    ]
}
```
Notice that the trackers member follows the same structure as mentioned in the Trackers section above.

### Response

```json
{
  "conversationId": "5815170693595136",
  "jobId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```

### Async Video File API
The Tracker entities should be passed in as a **query parameter** in the Async Video API’s URL like shown below:

### API Endpoint

```json
"https"://api.symbl.ai/v1/process/video?trackers=[
   {
      "name":"COVID-19",
      "vocabulary":[
         "social distancing",
         "cover your face with mask",
         "vaccination"
      ]
   }
]
```

### Request Header

Header Name  | Required | Description
---------- | ------- |  ------- |
```Authorization``` | Mandatory | `Bearer <token>` The token you get from our [authentication process](/docs/developer-tools/authentication).
```Content-Type	``` | Optional | `application/json` This header must contain the MIME Type of the audio file’s container.
```x-api-key``` | Optional | DEPRECATED. The JWT token you get from our [authentication process](/docs/developer-tools/authentication).

Notice that the trackers query parameter follows the same structure as mentioned in the Trackers section above.

### Response

```json
{
  "conversationId": "5815170693595136",
  "jobId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```

### Async Video URL API
The Tracker entities should be passed in as a member of the request body of the Async Video URL API like shown below:

### API Endpoint

**<font color="orange">POST</font> `https://api.symbl.ai/v1/process/video/url`**

### Request Headers

Header Name  | Required | Description
---------- | ------- |  ------- |
```Authorization``` | Mandatory | `Bearer <token>` The token you get from our [authentication process](/docs/developer-tools/authentication).
```Content-Type	``` | Mandatory | `application/json` This header must contain the MIME Type application/json.
```x-api-key``` | Optional | DEPRECATED. The JWT token you get from our [authentication process](/docs/developer-tools/authentication).

### Request Body
```json
{
    "url": "<PUBLIC_VIDEO_FILE_URL>",
    "confidenceThreshold": 0.6,
    "timezoneOffset": 0,
    "trackers": [
        {
            "name": "Promotion Mention",
            "vocabulary": [
                "We have a special promotion going on if you book this before",
                "I can offer you a discount of 10 20 percent you being a new customer for us",
                "We have our month special this month",
                "We have a sale right now on"
            ]
        }
    ]
}
```
Notice that the trackers member follows the same structure as mentioned in the Trackers section above.

### Response

```json
{
  "conversationId": "5815170693595136",
  "jobId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```

### Async Text API
The Tracker entities should be passed in as a member of the **request body** of the Async Text API like shown below:

### API Endpoint

**<font color="orange">POST</font> `https://api.symbl.ai/v1/process/text`**


### Request Headers

Header Name  | Required | Description
---------- | ------- |  ------- |
```Authorization``` | Mandatory | `Bearer <token>` The token you get from our [authentication process](/docs/developer-tools/authentication).
```Content-Type	``` | Mandatory | `application/json` This header must contain the MIME Type application/json.
```x-api-key``` | Optional | DEPRECATED. The JWT token you get from our [authentication process](/docs/developer-tools/authentication).

### Request Body

```json
{
    "name": "My Sales Conversation",
    "conversationType": [
        "sales"
    ],
    "messages": [
        {
            "payload": {
                "content": "<CONVERSATION_PAYLOAD>",
                "contentType": "text/plain"
            },
            "from": {
                "name": "John",
                "userId": "john@example.com"
            }
        }
    ],
    "trackers": [
        {
            "name": "Promotion Mention",
            "vocabulary": [
                "We have a special promotion going on if you book this before",
                "I can offer you a discount of 10 20 percent you being a new customer for us",
                "We have our month special this month",
                "We have a sale right now on"
            ]
        }
    ]
}
```
Notice that the trackers member follows the same structure as the Trackers section above.

### Response

```json
{
  "conversationId": "5815170693595136",
  "jobId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```

## Create Trackers using Streaming API

You can create and consume Trackers in real-time using the Streaming APIs. 

To view the detailed documentation go to the Trackers with [Streaming API](/docs/streaming-api/code-snippets/consume-trackers-with-streaming-api) page. 


