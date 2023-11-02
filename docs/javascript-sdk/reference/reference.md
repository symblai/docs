---
id: api-reference
title: Javascript SDK Reference
slug: /javascript-sdk/reference
pagination_next: 'python-sdk/python-sdk'
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

---

## Public Methods

### init

```init (String appId, String appSecret)```

Authenticates with the Symbl API using the provided authentication credentials.

#### Parameters

Name | Description
-----|------------
`appId` | The Symbl Application ID you get from the [Symbl Platform](https://platform.symbl.ai)
`appSecret` | The Symbl Application Secret Token you get from the [Symbl Platform](https://platform.symbl.ai)
`basePath` | The base path of the endpoint. By default it is `https://api.symbl.ai`.
`accessToken` | The Symbl authentication Token you get from your `appId` and `appSecret`. This is an optional parameter you can use to authenticate using auth Token rather than the App ID and App Secret. See sample code [here](/docs/javascript-sdk/introduction#authenticate-using-token).  

#### Returns

A Promise which is resolved once the API is connected and authenticated with Symbl.

#### Code Example

```js
sdk.init({
  // APP_ID and APP_SECRET come from the Symbl Platform: https://platform.symbl.ai
  appId: APP_ID,
  appSecret: APP_SECRET,
  basePath: 'https://api.symbl.ai'
})
.then(() => console.log('SDK Initialized.'))
.catch(err => console.error('Error in initialization.', err));
```

---

### startEndpoint

```startEndpoint (<Telephony API Configuration Object> config)```

Connects to the [Telephony API](/docs/telephony/introduction) endpoint using the configuration object provided.

#### Parameters

Name | Description
-----|------------
`config` | Options specified for the [Telephony API Configuration Object](/docs/telephony-api/api-reference#request-parameters).

#### Returns

A Promise which is resolved once the connection to the endpoint has been established.

#### Example

```js
const connection = await sdk.startEndpoint({
  endpoint: {
    type: 'pstn',
    phoneNumber: "YOUR_PHONE_NUMBER",
  },
  insightTypes: ['action_item', 'question'],
  actions: [
    {
      invokeOn: 'stop',
      name: 'sendSummaryEmail',
      parameters: {
        emails: [
        	"user@example.com"
        ], // Add valid email addresses to received email
      },
    },
  ],
  data: {
    session: {
      name: 'My Test Meeting',
    },
  },
});
```

---

### stopEndpoint

```stopEndpoint (Object config)```

Stops an existing connection to the [Telephony API](/docs/telephony/introduction).

#### Parameters

Name | Description
-----|------------
`config` | Options which contains the `connectionId` needed to stop the connection.

#### Returns

A Promise which is resolved once the connection has been stopped.

#### Code Example

```js
sdk.stopEndpoint({
  connectionId: connection.connectionId,
}).then(() => {
  console.log('Stopped the connection');
  console.log('Summary Info:', connection.summaryInfo);
  console.log('Conversation ID:', connection.conversationId);
}).catch(err => console.error('Error while stopping the connection.', err));
```

---

### startRealtimeRequest

```startRealtimeRequest (<Streaming API Configuration Object> options)```

Connects to a [Streaming API](/docs/streamingapi/introduction) Web Socket endpoint using the provided configuration options.

#### Parameters

Name | Description
-----|------------
`options` | Options specified for the [Streaming API Configuration Object](/docs/streaming-api/api-reference#request-parameters).

#### Returns

A Promise which is resolved once real-time request has been established.

#### Event Handlers

View the [Event Handlers](#event-handlers-1) section below to view which event handlers can be passed to the real-time connection.

#### Code Example

```js
const id = "unique_id";
const connection = await sdk.startRealtimeRequest({
  id,
  insightTypes: ['action_item', 'question'],
  config: {
    meetingTitle: 'My Test Meeting',
    confidenceThreshold: 0.7,
    timezoneOffset: 480, // Offset in minutes from UTC
    languageCode: 'en-US',
    sampleRateHertz
  },
  speaker: {
    // Optional, if not specified, will simply not send an email in the end.
    userId: 'emailAddress', // Update with valid email
    name: 'My name'
  },
  handers: {}  // See Event Handlers section below for reference
});
```
---

### subscribeToConnection

```subscribeToConnection (String connectionId, Function callback)```

Subscribes to an existing connection which will fire a callback for every event that happens on the connection.

#### Parameters

Name | Description
-----|------------
`connectionId` | You receive the connection ID after connecting with [startRealtimeRequest](#startrealtimerequest) or [startEndpoint](#startendpoint).
`callback` | A callback method which will be called on for every new event.

#### Code Example

```js
sdk.subscribeToConnection(connectionId, (data) => {
  const {type} = data;
  if (type === 'transcript_response') {
    const {payload} = data;

    // You get live transcription here!!
    process.stdout.write('Live: ' + payload && payload.content + '\r');
  } else if (type === 'message_response') {
    const {messages} = data;

    // You get processed messages in the transcript here!!! Real-time but not live! :)
    messages.forEach(message => {
      process.stdout.write('Message: ' + message.payload.content + '\n');
    });
  } else if (type === 'insight_response') {
    const {insights} = data;
    // You get any insights here!!!
    insights.forEach(insight => {
      process.stdout.write(`Insight: ${insight.type} - ${insight.text} \n\n`);
    });
  }
});
```

---

### subscribeToStream

The `subscribeToStream` function allows you to subscribe to an existing streaming connection in read-only mode. It takes the following parameters:

| Parameters | Type | Example | 
| ---------- | ------- | ------- | 
| `id` | String | Connection ID created on connection `init`|

This is a function of our [Subscribe API](/docs/subscribe-api). 

---

### pushEventOnConnection

```pushEventOnConnection (String connectionId, Event event, Function callback)```

Pushes an Event to an existing connection. An Event is a way to accept external asynchronous events that can be used by Symbl for enhancing it’s processing. Currently only [SpeakerEvent](/docs/javascript-sdk/code-snippets/active-speaker-events/#speaker-event) is supported.

#### Speaker Event

SpeakerEvent is a type of event Symbl can accept that provides information about the speaker talking activity. Symbl can accept the speaker talking events in real-time via WebSocket or REST API while the call/meeting is progress. Speaker Events can be accepted for recorded processing too. Read more about SpeakerEvents [here]((/docs/javascript-sdk/code-snippets/active-speaker-events/#speaker-event).

#### Parameters

Name | Description
-----|------------
`connectionId` | You receive the connection ID after connecting with [startRealtimeRequest](#startrealtimerequest) or [startEndpoint](#startendpoint).
`event` | An event (such as a [SpeakerEvent](/docs/javascript-sdk/code-snippets/active-speaker-events/#speaker-event)) which is the event to be pushed onto the connection.
`callback` | A callback method which will be called on for every new event.

#### Code Example

```js
const {sdk, SpeakerEvent} = require("@symblai/symbl-js);
const speakerEvent = new SpeakerEvent();
speakerEvent.type = SpeakerEvent.types.startedSpeaking;
speakerEvent.user = {
  userId: 'john@example.com',
  name: 'John'
};
speakerEvent.timestamp = new Date().toISOString();

sdk.pushEventOnConnection(
  connectionId,
  speakerEvent.toJSON(),
  (err) => {
    if (err) {
      console.error('Error during push event.', err);
    } else {
      console.log('Event pushed!');
    }
  }
);
```

## Event Handlers

When connecting using [`startRealtimeRequest`](#startrealtimerequest), you can pass various handlers in the configuration options which be called if the specific event attached to the handler is fired.

#### Code Example

```js
handlers: {
  /**
   * This will return live speech-to-text transcription of the call.
   */
  onSpeechDetected: (data) => {
    console.log(JSON.stringify(data))
    if (data) {
      const {punctuated} = data
      console.log('Live: ', punctuated && punctuated.transcript)
    }
  },
  /**
   * When processed messages are available, this callback will be called.
   */
  onMessageResponse: (data) => {
    console.log('onMessageResponse', JSON.stringify(data, null, 2))
  },
  /**
   * When Symbl detects an insight, this callback will be called.
   */
  onInsightResponse: (data) => {
    console.log('onInsightResponse', JSON.stringify(data, null, 2))
  },
  /**
   * When Symbl detects a topic, this callback will be called.
   */
  onTopicResponse: (data) => {
    console.log('onTopicResponse', JSON.stringify(data, null, 2))
  }
  /**
   * When Symbl detects a tracker word, this callback will be called.
   */
  onTrackerResponse: (data) => {
    console.log('onTrackerResponse', JSON.stringify(data.trackers, null, 2));
  }
}
```

### onSpeechDetected

To retrieve the real-time transcription results as soon as they are detected. You can use this callback to render live transcription which is specific to the speaker of this audio stream.

#### onSpeechDetected JSON Response Example

```js
{
  "type": "recognition_result",
  "isFinal": true,
  "payload": {
    "raw": {
      "alternatives": [{
        "words": [{
          "word": "Hello",
          "startTime": {
            "seconds": "3",
            "nanos": "800000000"
          },
          "endTime": {
            "seconds": "4",
            "nanos": "200000000"
          }
        }, {
          "word": "world.",
          "startTime": {
            "seconds": "4",
            "nanos": "200000000"
          },
          "endTime": {
            "seconds": "4",
            "nanos": "800000000"
          }
        }],
        "transcript": "Hello world.",
        "confidence": 0.9128385782241821
      }]
    }
  },
  "punctuated": {
    "transcript": "Hello world."
  },
  "user": {
    "userId": "emailAddress",
    "name": "John Doe",
    "id": "23681108-355b-4fc3-9d94-ed47dd39fa56"
  }
}
```

### onMessageResponse

This callback function contains the "finalized" transcription data for this speaker and if used with multiple streams with other speakers this callback would also provide their messages.

The "finalized" messages mean that the automatic speech recognition has finalized the state of this part of transcription and has declared it "final". Therefore, this transcription will be more accurate than [`onSpeechDetected`](#onspeechdetected).

#### onMessageResponse JSON Response Example

```js
[{
  "from": {
    "id": "0a7a36b1-047d-4d8c-8958-910317ed9edc",
    "name": "John Doe",
    "userId": "emailAddress"
  },
  "payload": {
    "content": "Hello world.",
    "contentType": "text/plain"
  },
  "id": "59c224c2-54c5-4762-9582-961bf250b478",
  "channel": {
    "id": "realtime-api"
  },
  "metadata": {
    "disablePunctuation": true,
    "timezoneOffset": 480,
    "originalContent": "Hello world.",
    "words": "[{\"word\":\"Hello\",\"startTime\":\"2021-02-04T20:34:59.029Z\",\"endTime\":\"2021-02-04T20:34:59.429Z\"},{\"word\":\"world.\",\"startTime\":\"2021-02-04T20:34:59.429Z\",\"endTime\":\"2021-02-04T20:35:00.029Z\"}]",
    "originalMessageId": "59c224c2-54c5-4762-9582-961bf250b478"
  },
  "dismissed": false,
  "duration": {
    "startTime": "2021-02-04T20:34:59.029Z",
    "endTime": "2021-02-04T20:35:00.029Z"
  }
}]
```

### onInsightResponse

This callback provides you with any of the detected insights in real-time as they are detected. As with the [`onMessageResponse`](#onmessageresponse) this would also return every speaker's insights in case of multiple streams.

#### onInsightResponse JSON Response Example

```json
[{
  "id": "94020eb9-b688-4d56-945c-a7e5282258cc",
  "confidence": 0.9909798145016999,
  "messageReference": {
    "id": "94020eb9-b688-4d56-945c-a7e5282258cc"
  },
  "hints": [{
    "key": "informationScore",
    "value": "0.9782608695652174"
  }, {
    "key": "confidenceScore",
    "value": "0.9999962500210938"
  }, {
    "key": "comprehensionScore",
    "value": "0.9983848333358765"
  }],
  "type": "action_item",
  "assignee": {
    "id": "e2c5acf8-b9ed-421a-b3b3-02a5ae9796a0",
    "name": "John Doe",
    "userId": "emailAddress"
  },
  "dueBy": {
    "value": "2021-02-05T00:00:00-07:00"
  },
  "tags": [{
    "type": "date",
    "text": "today",
    "beginOffset": 39,
    "value": {
      "value": {
        "datetime": "2021-02-05"
      }
    }
  }, {
    "type": "person",
    "text": "John Doe",
    "beginOffset": 8,
    "value": {
      "value": {
        "name": "John Doe",
        "id": "e2c5acf8-b9ed-421a-b3b3-02a5ae9796a0",
        "assignee": true,
        "userId": "emailAddress"
      }
    }
  }],
  "dismissed": false,
  "payload": {
    "content": "Perhaps John Doe can submit the report today.",
    "contentType": "text/plain"
  },
  "from": {
    "id": "e2c5acf8-b9ed-421a-b3b3-02a5ae9796a0",
    "name": "John Doe",
    "userId": "emailAddress"
  }
}]
```

### onTopicResponse

This callback provides you with any of the detected topics in real-time as they are detected.  As with the [`onMessageResponse`](#onmessageresponse) this would also return every topic in case of multiple streams.

#### onTopicResponse JSON Response Example

```json
[{
  "id": "e69a5556-6729-11eb-ab14-2aee2deabb1b",
  "messageReferences": [{
    "id": "0df44422-0248-47e9-8814-e87f63404f2c",
    "relation": "text instance"
  }],
  "phrases": "auto insurance",
  "rootWords": [{
    "text": "auto"
  }],
  "score": 0.9,
  "type": "topic"
}]
```

### onTrackerResponse

This callback provides you with any of the detected trackers in real-time as they are detected. As with the [`onMessageResponse`](#onmessageresponse) this would also return every tracker in case of multiple streams.

#### onTrackerResponse JSON Response Example

```json
{
  "type": "tracker_response",
  "isFinal": true,
  "trackers": [
    {
      "name": "Goodness",
      "matches": [
        {
          "type": "vocabulary",
          "value": "This is awesome",
          "messageRefs": [
            {
              "id": "fa93aa64-0e8d-4697-bb52-e2916ca63192",
              "text": "This is awesome.",
              "offset": 0
            }
          ],
          "insightRefs": []
        },
        {
          "type": "vocabulary",
          "value": "Hello world",
          "messageRefs": [
            {
              "id": "8e720656-fed7-4b11-b359-3931c53bbcec",
              "text": "Hello world.",
              "offset": 0
            }
          ],
          "insightRefs": []
        }
      ]
    },
    {
      "name": "Goodness",
      "matches": [
        {
          "type": "vocabulary",
          "value": "I like it",
          "messageRefs": [
            {
              "id": "193dc144-2b55-4214-b211-ab83bd3e4a2e",
              "text": "I love it.",
              "offset": -1
            }
          ],
          "insightRefs": []
        }
      ]
    }
  ],
  "sequenceNumber": 1
}
```
