---
id: post-audio-url
title: POST Audio URL API
slug: /async-api/overview/audio/post-audio-url/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

---

The Async Audio URL API accepts a URL to an audio file of which you want to process.

It can be utilized for any use case where you have access to recorded audio stored publicly as URL and want to extract insights and other conversational attributes supported by [Symbl's Conversation API](/docs/conversation-api/introduction).

:::tip URL Requirement
The URL provided must be a publicly available URL. Currently, we do not support any redirected links, shortened links (e.g. bit.ly), YouTube, Vimeo, or links from any audio/video platforms.
:::

### Authentication
Before using this API, you must generate your authentication token (`AUTH_TOKEN`). To learn how to get the authentication token, see the [Authentication](/docs/developer-tools/authentication) page.

### API Endpoint

`POST https://api.symbl.ai/v1/process/audio/url`


### Example API Call

<Tabs
  defaultValue="cURL"
  values={[
    { label: 'cURL', value: 'cURL', },
    { label: 'Native Javascript', value: 'javascript', },
    { label: 'Node.js', value: 'nodejs', },
    { label: 'Python', value: 'python' }
  ]
}>
<TabItem value="cURL">

```shell
curl --location --request POST "https://api.symbl.ai/v1/process/audio/url" \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $AUTH_TOKEN" \
--data-raw '{
  "url": "https://symbltestdata.s3.us-east-2.amazonaws.com/sample_audio_file.wav",
  "name": "Business Meeting",
  "confidenceThreshold": 0.6,
}'
```
</TabItem>

<TabItem value="javascript">

```js
const authToken = AUTH_TOKEN;

const payload = {
  // A valid url string. The URL must be a publicly accessible url.
  "url": "https://symbltestdata.s3.us-east-2.amazonaws.com/sample_audio_file.wav",

  // <Optional, string| your_conversation_name | Your meeting name. Default name set to conversationId.>
  "name": "Business Meeting",

  // <Optional, string| your_webhook_url| Webhook url on which job updates to be sent. (This should be post API)>
  // "webhookUrl": "https://yourdomain.com/jobs/callback",

  // <Optional, list| custom_vocabulary_list> |Contains a list of words and phrases that provide hints to the speech recognition task.
  // "customVocabulary": ["Platform", "Discussion", "Targets"],

  // <Optional, double| confidence_threshold | Minimum required confidence for the insight to be recognized.>
  "confidenceThreshold": 0.6,

  // <Optional, boolean| detect_phrases> |Accepted values are true & false. It shows Actionable Phrases in each sentence of conversation. These sentences can be found in the Conversation's Messages API.
  // "detectPhrases": true,

  // <Optional, boolean| enable_separate_recognition_per_channel> |Enables Speaker Separated Channel audio processing. Accepts true or false.
  // "enableSeparateRecognitionPerChannel": true,

  // <Optional, boolean| channel_metadata> |This object parameter contains two variables speaker and channel to specific which speaker corresponds to which channel. This object only works when enableSeparateRecognitionPerChannel query param is set to true.
  // "channelMetadata": [{"channel": 1, "speaker": {"name": "Robert Bartheon", "email": "robertbartheon@example.com"}}],

  // <Optional, boolean| language_code> |code of language of recording.
  // "languageCode": "en-US"
};

const responses = {
  400: 'Bad Request! Please refer docs for correct input fields.',
  401: 'Unauthorized. Please generate a new access token.',
  404: 'The conversation and/or it\'s metadata you asked could not be found, please check the input provided',
  429: 'Maximum number of concurrent jobs reached. Please wait for some requests to complete.',
  500: 'Something went wrong! Please contact support@symbl.ai'
}

const fetchData = {
  method: "POST",
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
}

fetch("https://api.symbl.ai/v1/process/audio/url", fetchData).then(response => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(responses[response.status]);
  }
}).then(response => {
  console.log('response', response);
}).catch(error => {
  console.error(error);
});
```

</TabItem>

<TabItem value="nodejs">

```js
const request = require('request');
const authToken = AUTH_TOKEN;

const audioOption = {
  url: 'https://api.symbl.ai/v1/process/audio/url',
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    // A valid url string. The URL must be a publicly accessible url.
    "url": "https://symbltestdata.s3.us-east-2.amazonaws.com/sample_audio_file.wav",

    // <Optional, string| your_conversation_name | Your meeting name. Default name set to conversationId.>
    "name": "Business Meeting",

    // <Optional, string| your_webhook_url| Webhook url on which job updates to be sent. (This should be post API)>
    // "webhookUrl": "https://yourdomain.com/jobs/callback",

    // <Optional, list| custom_vocabulary_list> |Contains a list of words and phrases that provide hints to the speech recognition task.
    // "customVocabulary": ["Platform", "Discussion", "Targets"],

    // <Optional, double| confidence_threshold | Minimum required confidence for the insight to be recognized.>
    "confidenceThreshold": 0.6,

    // <Optional, boolean| detect_phrases> |Accepted values are true & false. It shows Actionable Phrases in each sentence of conversation. These sentences can be found in the Conversation's Messages API.
    // "detectPhrases": true,

    // <Optional, boolean| enable_separate_recognition_per_channel> |Enables Speaker Separated Channel audio processing. Accepts true or false.
    // "enableSeparateRecognitionPerChannel": true,

    // <Optional, boolean| channel_metadata> |This object parameter contains two variables speaker and channel to specific which speaker corresponds to which channel. This object only works when enableSeparateRecognitionPerChannel query param is set to true.
    // "channelMetadata": [{"channel": 1, "speaker": {"name": "Robert Bartheon", "email": "robertbartheon@example.com"}}],

    // <Optional, boolean| language_code> |code of language of recording.
    // "languageCode": "en-US"
  })
};

const responses = {
  400: 'Bad Request! Please refer docs for correct input fields.',
  401: 'Unauthorized. Please generate a new access token.',
  404: 'The conversation and/or it\'s metadata you asked could not be found, please check the input provided',
  429: 'Maximum number of concurrent jobs reached. Please wait for some requests to complete.',
  500: 'Something went wrong! Please contact support@symbl.ai'
}

request.post(audioOption, (error, response, body) => {
  const statusCode = response.statusCode;
  if (error || Object.keys(responses).indexOf(statusCode.toString()) !== -1) {
    throw new Error(responses[statusCode]);
  }
  console.log('Status code: ', statusCode);
  console.log('Body', response.body);
});
```

</TabItem>
<TabItem value="python">

```py
import json
import requests

url = "https://api.symbl.ai/v1/process/audio/url"

# set your access token here. See https://docs.symbl.ai/docs/developer-tools/authentication
access_token = 'your_access_token'

headers = {
    'Authorization': 'Bearer ' + access_token,
    'Content-Type': 'application/json'
}

payload = {
    'url': "https://symbltestdata.s3.us-east-2.amazonaws.com/sample_audio_file.wav",
    # A valid url string. The URL must be a publicly accessible url.

    'name': "Business Meeting",
    # <Optional, string| your_conversation_name | Your meeting name. Default name set to conversationId.>

    # 'webhookUrl': "https://yourdomain.com/jobs/callback",
    # <Optional, string| your_webhook_url| Webhook url on which job updates to be sent. (This should be post API)>

    # 'customVocabulary': ['Platform', 'Discussion', 'Targets'],
    # <Optional, list| custom_vocabulary_list> |Contains a list of words and phrases that provide hints to the speech recognition task.

    'confidenceThreshold': 0.6,
    # <Optional, double| confidence_threshold | Minimum required confidence for the insight to be recognized.>

    # 'detectPhrases': True,
    # <Optional, boolean| detect_phrases> |Accepted values are true & false. It shows Actionable Phrases in each sentence of conversation. These sentences can be found in the Conversation's Messages API.

    # 'enableSeparateRecognitionPerChannel': True,
    # <Optional, boolean| enable_separate_recognition_per_channel> |Enables Speaker Separated Channel audio processing. Accepts true or false.

    # 'channelMetadata': [{"channel": 1, "speaker": {"name": "Robert Bartheon", "email": "robertbartheon@example.com"}}],
    # <Optional, boolean| channel_metadata> |This object parameter contains two variables speaker and channel to specific which speaker corresponds to which channel. This object only works when enableSeparateRecognitionPerChannel query param is set to true.

    # 'languageCode': "en-US"
    # <Optional, boolean| language_code> |code of language of recording.
}

responses = {
    400: 'Bad Request! Please refer docs for correct input fields.',
    401: 'Unauthorized. Please generate a new access token.',
    404: 'The conversation and/or it\'s metadata you asked could not be found, please check the input provided',
    429: 'Maximum number of concurrent jobs reached. Please wait for some requests to complete.',
    500: 'Something went wrong! Please contact support@symbl.ai'
}

response = requests.request("POST", url, headers=headers, data=json.dumps(payload))

if response.status_code == 201:
    # Successful API execution
    print("conversationId => " + response.json()['conversationId'])  # ID to be used with Conversation API.
    print("jobId => " + response.json()['jobId'])  # ID to be used with Job API.
elif response.status_code in responses.keys():
    print(responses[response.status_code])  # Expected error occurred
else:
    print("Unexpected error occurred. Please contact support@symbl.ai" + ", Debug Message => " + str(response.text))

exit()
```

</TabItem>
</Tabs>

### Request Headers

Header Name  | Required | Description
---------- | ------- |  ------- |
```Authorization``` | Yes | `Bearer <token>` The token you get from our [authentication process](/docs/developer-tools/authentication).
```Content-Type	``` | Yes | Accepted value: `application/json`
```x-api-key``` | No | DEPRECATED. The JWT token you get from our [authentication process](/docs/developer-tools/authentication).

### Request Body

```json
{
  "url": "https://symbltestdata.s3.us-east-2.amazonaws.com/sample_audio_file.wav",
  "customVocabulary": [
    "Platform",
    "Discussion",
    "Targets"
  ],
  "confidenceThreshold": 0.6,
  "detectPhrases": true,
  "name": "Business Meeting",
  "webhookUrl": "",
  "entities": [
    {
      "customType": "Company Executives",
      "value": "Marketing director",
      "text": "Marketing director"
    }
  ],
  "detectEntities": true,
  "languageCode": "en-US",
  "mode": "phone",
  "enableSeparateRecognitionPerChannel": true,
  "channelMetadata": [],
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

### Request Body Parameters

Parameter |  Description
---------- | ------- | 
```url``` | String, mandatory <br/><br/> A valid url string. The URL must be a publicly accessible url. <br/><br/> Example: `"url": "https://symbltestdata.s3.us-east-2.amazonaws.com/sample_audio_file.wav"`
```customVocabulary``` | String, optional <br/><br/> Contains a list of words and phrases that provide hints to the speech recognition task. <br/><br/> Example: `"customVocabulary":  "Platform", "Discussion"`
```confidenceThreshold``` | Double, optional <br/><br/> Minimum confidence score that you can set for an API to consider it as a valid insight (action items, follow-ups, topics, and questions). It should be in the range <=0.5 to <=1.0 (i.e., greater than or equal to `0.5` and less than or equal to `1.0`.). The default value is `0.5`. <br/><br/> Example: `"confidenceThreshold": 0.6`
```detectPhrases```| Boolean, optional <br/><br/> It shows Actionable Phrases in each sentence of conversation. These sentences can be found using the Conversation's  Messages API. Default value is `false`. <br/><br/> Example: `"detectPhrases": true`
```name``` | String, optional <br/><br/> Your meeting name. Default name set to `conversationId`. <br/><br/> Example: `name: "Sales call"`, `name: "Customer call"`. 
```webhookUrl``` | String, optional <br/><br/> The URL where Symbl sends an HTTP request to your application when the job status is updated. This should be after making the API request. See the [Webhook section](/docs/async-api/overview/text/post-text#webhookurl) for more. <br/><br/> Example: `"""jobId"": ""9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"", ""status"": ""in_progress"""`
```entities``` | Object, optional  <br/><br/>  Input custom entities which can be detected in conversation using [Entities API](/docs/conversation-api/entities). <br/><br/> Example: `"entities": "customType": "Company Executives", "value": "Marketing director", "text": "Marketing director"`
```detectEntities``` | Boolean, optional  <br/><br/> Default value is `false`. If not set the [Entities API](/docs/conversation-api/entities) will not return any entities from the conversation. <br/><br/> Example: `"detectEntities": true`
 ```languageCode```| String, optional <br/><br/> We accept different languages. Please [check language Code](/docs/async-api/overview/async-api-supported-languages) as per your requirement. <br/><br/> Example: `"languageCode": "en-US"`
  ``` mode``` | String, optional <br/><br/> Accepts `phone` or `default`. `phone` mode is best for audio that is generated from phone call(which is typically recorded at 8khz sampling rate).<br />`default` mode works best for audio generated from video or online meetings(which is typically recorded at 16khz or more sampling rate).<br />When you don't pass this parameter `default` is selected automatically. <br/><br/> Example: `"mode": "phone"` 
```enableSeparateRecognitionPerChannel``` | Boolean, optional  <br/><br/> Enables Speaker Separated Channel audio processing. Accepts `true` or `false`. <br/><br/> Example: `"enableSeparateRecognitionPerChannel": true`
```channelMetadata``` | Object, optional  <br/><br/> This object parameter contains two variables `speaker` and `channel` to specific which speaker corresponds to which channel. This object **only** works when `enableSeparateRecognitionPerChannel` is set to `true`. Learn more in the [Channel Metadata](#channel-metadata) section below. <br/><br/> Example: `"channelMetadata": "channel": 1, "speaker": "name": "Robert Bartheon", "email": "robertbartheon@example.com"`
```trackers```<font color="orange"> BETA </font> | List, optional  <br/><br/> A `tracker` entity containing `name` and `vocabulary` (a list of key words and/or phrases to be tracked). Read more in the [Tracker API](/docs/management-api/trackers/overview) section. <br/><br/> Example: `"trackers": "name": "Promotion Mention", "vocabulary": "We have a special promotion going on if you book this before"`
```enableAllTrackers```<font color="orange"> BETA </font> | Boolean, optional  <br/><br/> Default value is `false`. Setting this parameter to `true` will enable detection of all the Trackers maintained for your account by the Management API. This will allow Symbl to detect all the available Trackers in a specific Conversation.  Learn about this parameter [here](/docs/management-api/trackers/overview#step-2-submit-files-using-async-api-with-enablealltrackers-flag).  <br/><br/> Example: `"enableAllTrackers": true`  
```enableSummary```<font color="blue"> ALPHA </font> | Boolean, optional  <br/><br/> Setting this parameter to `true` allows you to generate Summaries using [Summary API](/conversation-api/summary). Ensure that you use `https://api.symbl.ai/` as the base URL. <br/><br/> Example: `"enableSummary": true`  
```enableSpeakerDiarization``` | Boolean, optional  <br/><br/>  Whether the diarization should be enabled for this conversation. Pass this as `true` to enable Speaker Separation. To learn more, refer to the [Speaker Separation](#speaker-separation) section below. <br/><br/> Example: `  "enableSeparateRecognitionPerChannel": true`
```diarizationSpeakerCount``` | Integer, optional <br/><br/> The number of unique speakers in this conversation. To learn more, refer to the [Speaker Separation](#speaker-separation) section below. <br/><br/> Example: `diarizationSpeakerCount=$NUMBER_OF_UNIQUE_SPEAKERS"`

#### Channel Metadata

The `channelMetadata` object has the members `channel` and `speaker`.
Given below is an example of a `channelMetadata` object:

```js
{
  "channelMetadata": [
    {
      "channel": 1,
      "speaker": {
        "name": "Robert Bartheon",
        "email": "robertbartheon@example.com"
      }
    },
    {
      "channel": 2,
      "speaker": {
        "name": "Arya Stark",
        "email": "aryastark@example.com"
      }
    }
  ]
}
```

`channelMetadata` object has following members:

Field | Description
| ------- | ------- 
```channel``` | Integer, mandatory <br/><br/> This denotes the channel number in the audio file. Each channel will contain independent speaker's voice data. 
```speaker``` | String, mandatory <br/><br/> This is the wrapper object which defines the speaker for this channel. 

`speaker`  has the following members:

Field | Description
| ------- | ------- 
```name``` | String, optional <br/><br/> Name of the speaker. 
```email``` | String, optional <br/><br/> Email address of the speaker. 

### Response 

```js
{
  "conversationId": "5815170693595136",
  "jobId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```

Field | Description
---------- | ------- |
`conversationId` | ID to be used with [Conversation API](/docs/conversation-api/introduction). 
`jobId` | ID to be used with Job API. 
 
### Speaker Separation
---

The Async Audio & Async Video APIs can detect and separate unique speakers in a single stream of audio & video without the need for separate speaker events.

To enable this capability with either of the APIs the `enableSpeakerDiarization` and `diarizationSpeakerCount` query parameters need to be passed with the request. The `diarizationSpeakerCount` should be equal to the number of unique speakers in the conversation. If the number varies then this might introduce false positives in the diarized results.

👉 To learn how to implement Speaker Separation, see [How to implement Speaker Separation](/docs/async-api/tutorials/get-speaker-separation-audio-video) page.

If you’re looking for similar capability in Real-Time APIs, refer to [Active Speaker Events](/docs/javascript-sdk/code-snippets/active-speaker-events) and Speaker Separation in WebSocket API sections.

:::note
**Speaker Diarization Language Support**

Currently, Speaker Diarization is available for English and Spanish languages only.

**Billing for Speaker Separated Channels**

The billing for a speaker separated channel audio file is according to the number of channels present in the audio files. The duration for billing will be calculated according to the below formula:

`totalDuration = duration_of_the_audio_file * total_number_of_channels`

So, if you send a 120-second file with 3 speaker separated channels, the total duration for billing would be 360 seconds or 6 minutes.
:::

### Using Webhook 
---

The `webhookUrl` will be used to send the status of job created for uploaded audio URL. Every time the status of the job changes it will be notified on the Webhook Url.

##### Code Example

```js
{
  "jobId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "status": "in_progress"
}
```

Field | Description
| ------- | -------
```jobId``` | ID to be used with [Job API](/docs/async-api/overview/jobs-api). 
```status``` |  Current status of the job. (Valid statuses: [ `scheduled`, `in_progress`, `completed`, `failed` ]) 

### API Limit Error
---
```js
{
  "statusCode" : 429,
  "message" : "This API has a limit of maximum of `X` number of concurrent jobs per account. If you are looking to scale, and need more concurrent jobs than this limit, please contact us at support@symbl.ai"
}
```

Here value of `X` can be found in [FAQ](/docs/faq). 

:::caution
You must wait for the job to complete processing before you proceed with getting the Conversation Intelligence. If you immediately make a GET request to Conversation API, it is possible that you'll receive incomplete insights. Therefore, ensure that you wait for the job to complete.
:::
