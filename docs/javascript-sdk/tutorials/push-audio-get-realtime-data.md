---
id: push-audio-get-real-time-data
title: Live speech to text and AI insights on local server
slug: /javascript-sdk/tutorials/receive-ai-insights-from-your-computer/
---

---

In this guide you will be shown how to use Symbl's Javascript SDK to enable your device's microphone for recording audio and processing. This example was built to run on Mac or Windows PCs. You will learn how to use Symbl's API for speech-to-text transcription and real-time AI insights, such as [follow-ups](/docs/concepts/follow-ups), [action items](/docs/concepts/action-items), [topics](/docs/concepts/topics) and [questions](/docs/conversation-api/questions).

Throughout the guide you'll find various references to these variable names, which you will have to replace with your values:

Key  | Description
---------- | -------
```appId``` | The application ID you get from the [home page of the platform](https://platform.symbl.ai/).
```appSecret``` | The application secret you get from the [home page of the platform](https://platform.symbl.ai/).
```emailAddress``` | The email address you wish to send the summary email to. The summary email summarizes the conversation and any conversational insights gained from it.

[View the full example on GitHub](
https://github.com/symblai/receive-ai-insights-with-real-time-websockets)

:::info Identification and Redaction of PII data
Symbl allows you to identify and redact Personally Identifiable Information (PII) from messages and insights with Streaming APIs. Learn more in the [PII Identification and Redaction](/docs/concepts/redaction-pii) page.
:::

## Contents

In this guide you will learn the following:

* [Getting Started](#getting-started)
* [Initialize SDK](#initialize-sdk)
* [Real-time Request Configuration Options](#real-time-request-configuration-options)
    * [Insight Types (insightTypes)](#insight-types-insighttypes)
    * [Config (config)](#config-config)
    * [Speaker (speaker)](#speaker-speaker)
    * [Handlers (handlers)](#handlers-handlers)
    * [Full Configuration Object](#full-configuration-object)
* [Handle the audio stream](#handle-the-audio-stream)
* [Process speech using device's microphone](#process-speech-using-the-devices-microphone)
* [Test](#test)
* [Grabbing the Conversation ID](#grabbing-the-conversation-id)
* [Full Code Sample](#full-code-sample)
* [Query Params](#query-params)

## Getting started

To get this example running, you need to install the node packages `@symblai/symbl-js`, `uuid` and `mic`. You can do that via with `npm install @symblai/symbl-js`, `npm install uuid` and `npm install mic`. We're using `mic` to simply get audio from the microphone and pass it on to the WebSocket connection. 

`mic` also requires you to install `sox`. To install `sox` choose the option which fits your operating system:

**Mac**: `brew install sox` <br />
**Windows and Linux**: [Installation of SoX on different Platforms](https://at.projects.genivi.org/wiki/display/PROJ/Installation+of+SoX+on+different+Platforms)

```javascript
const {sdk} = require('@symblai/symbl-js');
```

Simple setup for `mic`. You can view the full configuration options for `mic` [here](https://github.com/ashishbajaj99/mic)


```javascript
const mic = require('mic');
const sampleRateHertz = 16000;
const micInstance = mic({
  rate: sampleRateHertz,
  channels: '1',
  debug: false,
  exitOnSilence: 6
});
```

## Initialize SDK

You can get the `appId` and `appSecret` values from the [Symbl Platform](https://platform.symbl.ai).

```javascript
(async () => {
  try {
    await sdk.init({
      appId: appId,
      appSecret: appSecret,
      basePath: 'https://api.symbl.ai'
    })
  } catch (e) {}
})()
```
You will also need a unique ID to associate with our Symbl request. You will create
this ID using `uuid` package

```js
const id = uuid();
```


## Real-time Request Configuration Options 

Now you can start the connection using `sdk.startRealtimeRequest`. You will need to create a configuration object for the connection


```js
const connection = await sdk.startRealtimeRequest(configurationObject);
```

Here is the breakdown of the configuration types:

### Insight Types (`insightTypes`)

* `insightTypes` - This array represents the type of insights that are to be detected. Today the supported types are `action_item` and `question`.

```js
{
  insightTypes: ['action_item', 'question']
}
```

#### Action Item (`action_item`)

An action item is a specific outcome recognized in the conversation that requires one or more people in the conversation to act in the future. Action items will be returned via the `onInsightResponse` callback.

These actions can be definitive and owned with a commitment to working on a presentation, sharing a file, completing a task, etc. Or they can be non-definitive like an idea, suggestion or an opinion that could be worked upon.

All action items are generated with action phrases, assignees and due dates so that you can build workflow automation with your tools.


##### Action Item JSON Response Example

This is an example of an `action_item` returned via the `onInsightResponse` callback function.

```js
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


#### Question (`question`)

The API will find explicit questions or request for information that comes up during the conversation. Questions will be returned via the `onInsightResponse` callback.

##### Question JSON Response Example

This is an example of a `question` returned via the `onInsightResponse` callback function.


```js
[
  {
    "id": "5a1fc496-bdda-4496-93cc-ef9714a63b1b",
    "confidence": 0.9677371919681392,
    "messageReference": {
      "id": "541b6de9-1d0d-40af-a506-54fdf52b996d"
    },
    "hints": [
      {
        "key": "confidenceScore",
        "value": "0.9998153329948111"
      },
      {
        "key": "comprehensionScore",
        "value": "0.9356590509414673"
      }
    ],
    "type": "question",
    "assignee": {
      "id": "7a717fc4-f292-4f26-88d3-ed63440e1f91",
      "name": "John Doe",
      "userId": "EMAIL_ADDRESS"
    },
    "tags": [],
    "dismissed": false,
    "payload": {
      "content": "How much will all of this cost?",
      "contentType": "text/plain"
    },
    "from": {
      "id": "7a717fc4-f292-4f26-88d3-ed63440e1f91",
      "name": "John Doe",
      "userId": "EMAIL_ADDRESS"
    }
  }
]
```

### Config (`config`)

```js
config: {
  meetingTitle: 'My Test Meeting',
  confidenceThreshold: 0.7,
  timezoneOffset: 480, // Offset in minutes from UTC
  languageCode: 'en-US',
  sampleRateHertz
},
```

* `config`: This configuration object encapsulates the properties which directly relate to the conversation generated by the audio being passed.

    * `meetingTitle`: This optional parameter specifies the name of the conversation generated. You can get more info on conversations [here](/docs/conversation-api/conversation-data)

    * `confidenceThreshold`: This optional parameter specifies the confidence threshold for detecting the insights. Only the insights that have `confidenceScore` more than this value will be returned.

    * `timezoneOffset`: This specifies the actual timezoneOffset used for detecting the time/date-related entities.

    * `languageCode`: It specifies the language to be used for transcribing the audio in BCP-47 format. (Needs to be same as the language in which audio is spoken)

    * `sampleRateHertz`: It specifies the sampleRate for this audio stream.


### Speaker (`speaker`)

```js
speaker: {
  // Optional, if not specified, will simply not send an email in the end.
  userId: 'emailAddress', // Update with valid email
  name: 'My name'
},
```  

`speaker`: Optionally specify the details of the speaker whose data is being passed in the stream. This enables an e-mail with the Summary UI URL to be sent after the end of the stream.

### Handlers (`handlers`)

```js
handlers: {
  /**
   * This will return live speech-to-text transcription of the call.
   */
  onSpeechDetected: (data) => {
    if (data) {
      const {punctuated} = data
      console.log('Live: ', punctuated && punctuated.transcript)
      console.log('');
    }
    console.log('onSpeechDetected ', JSON.stringify(data, null, 2));
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
}
```


* `handlers`: This object has the callback functions for different events

    * `onSpeechDetected`: To retrieve the real-time transcription results as soon as they are detected. You can use this callback to render live transcription which is specific to the speaker of this audio stream.

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

    * `onMessageResponse`: This callback function contains the "finalized" transcription data for this speaker and if used with multiple streams with other speakers this callback would also provide their messages.
    The "finalized" messages mean that the automatic speech recognition has finalized the state of this part of transcription and has declared it "final". Therefore, this transcription will be more accurate than `onSpeechDetected`.

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

    * `onInsightResponse`: This callback provides you with any of the detected insights in real-time as they are detected. As with the `onMessageResponse` this would also return every speaker's insights in case of multiple streams.

    **View the examples for `onInsightResponse` [here](#insight-types-insighttypes).**

    * `onTrackerResponse`: This callback provides you with any of the detected trackers in real-time as they are detected.  As with the `onMessageResponse` this would also return every tracker in case of multiple streams.

    #### onTrackerResponse JSON Response Example

    ```json
    [
      {
        "id": "4527907378937856",
        "name": "My Awesome Tracker",
        "matches": [
          {
            "messageRefs": [
              {
                "id": "4670860273123328",
                "text": "Wearing mask is a good safety measure.",
                "offset": -1
              }
            ],
            "type": "vocabulary",
            "value": "wear mask",
            "insightRefs": []
          }
        ]
      }
    ]
    ```

    * `onTopicResponse`: This callback provides you with any of the detected topics in real-time as they are detected.  As with the `onMessageResponse` this would also return every topic in case of multiple streams.

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

### Full Configuration Object

```js
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
  handlers: {
    /**
     * This will return live speech-to-text transcription of the call.
     */
    onSpeechDetected: (data) => {
      if (data) {
        const {punctuated} = data
        console.log('Live: ', punctuated && punctuated.transcript)
        console.log('');
      }
      console.log('onSpeechDetected ', JSON.stringify(data, null, 2));
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
    },
    /**
     * When trackers are detected, this callback will be called.
     */
    onTrackerResponse: (data) => {
      console.log('onTrackerResponse', JSON.stringify(data, null, 2))
    },
  }
});
```

## Handle the audio stream

The connection should now be established to the Web Socket. Now you must create several handlers which will handle the audio stream. You can view all the valid handlers [here](https://github.com/ashishbajaj99/mic):

```js
const micInputStream = micInstance.getAudioStream()
/** Raw audio stream */
micInputStream.on('data', (data) => {
  // Push audio from Microphone to websocket connection
  connection.sendAudio(data)
})

micInputStream.on('error', function (err) {
  console.log('Error in Input Stream: ' + err)
})

micInputStream.on('startComplete', function () {
  console.log('Started listening to Microphone.')
})

micInputStream.on('silence', function () {
  console.log('Got SIGNAL silence')
})
```

## Process speech using the device's microphone

Now you start the recording:


```js
micInstance.start()
```

Your microphone should now be open to input which will be sent to the Web Socket for processing. The microphone will continue to accept input until the application is stopped or until you tell the connection to stop:


```js
/**
 * Stop connection after 1 minute i.e. 60 secs
 */
setTimeout(async () => {
  // Stop listening to microphone
  micInstance.stop()
  console.log('Stopped listening to Microphone.')
  try {
    // Stop connection
    await connection.stop()
    console.log('Connection Stopped.')
  } catch (e) {
    console.error('Error while stopping the connection.', e)
  }
}, 60 * 1000)
```

## Test
To verify and check if the code is working:

Run your code:
```bash
$ node index.js
```

## Grabbing the Conversation ID

The Conversation ID is very useful for our other APIs such as the [Conversation API](/docs/conversation-api/introduction). We don't use it in this example because it's mainly used for non-real-time data gathering, but it's good to know how to grab it as you can use the Conversation ID later to extract the conversation insights again.


```js
   const conversationId = connection.conversationId
```

With the Conversation ID you can do each of the following (and more!):

**[View conversation topics](/docs/conversation-api/get-topics)**<br />
Summary topics provide a quick overview of the key things that were talked about in the conversation.

**[View action items](/docs/conversation-api/action-items)**<br />
An action item is a specific outcome recognized in the conversation that requires one or more people in the conversation to take a specific action, e.g. set up a meeting, share a file, complete a task, etc.

**[View follow-ups](/docs/conversation-api/follow-ups)**<br />
This is a category of action items with a connotation to follow-up a request or a task like sending an email or making a phone call or booking an appointment or setting up a meeting.

## Full Code Sample

Here's the full sample below which you can also [view on Github](https://github.com/symblai/receive-ai-insights-with-real-time-websockets):

```js
const {sdk} = require('@symblai/symbl-js')
const uuid = require('uuid').v4

// For demo purposes, we're using mic to simply get audio from the microphone and pass it on to the WebSocket connection
const mic = require('mic')

const sampleRateHertz = 16000

const micInstance = mic({
  rate: sampleRateHertz,
  channels: '1',
  debug: false,
  exitOnSilence: 6,
});

(async () => {
  try {
    // Initialize the SDK
    await sdk.init({
      appId: appId,
      appSecret: appSecret,
      basePath: 'https://api.symbl.ai',
    })

    // Need unique Id
    const id = uuid()

    // Start Real-time Request (Uses Real-time WebSocket API behind the scenes)
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
      handlers: {
        /**
         * This will return live speech-to-text transcription of the call.
         */
        onSpeechDetected: (data) => {
          if (data) {
            const {punctuated} = data
            console.log('Live: ', punctuated && punctuated.transcript)
            console.log('');
          }
          console.log('onSpeechDetected ', JSON.stringify(data, null, 2));
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
      }
    });
    console.log('Successfully connected. Conversation ID: ', connection.conversationId);

    const micInputStream = micInstance.getAudioStream()
    /** Raw audio stream */
    micInputStream.on('data', (data) => {
      // Push audio from Microphone to websocket connection
      connection.sendAudio(data)
    })

    micInputStream.on('error', function (err) {
      console.log('Error in Input Stream: ' + err)
    })

    micInputStream.on('startComplete', function () {
      console.log('Started listening to Microphone.')
    })

    micInputStream.on('silence', function () {
      console.log('Got SIGNAL silence')
    })

    micInstance.start()

    setTimeout(async () => {
      // Stop listening to microphone
      micInstance.stop()
      console.log('Stopped listening to Microphone.')
      try {
        // Stop connection
        await connection.stop()
        console.log('Connection Stopped.')
      } catch (e) {
        console.error('Error while stopping the connection.', e)
      }
    }, 60 * 1000) // Stop connection after 1 minute i.e. 60 secs
  } catch (e) {
    console.error('Error: ', e)
  }
})();
```
### Query Params

Following are the optional query parameters that you can pass in this API:

Parameter | Required | Value |Description |
--------- | --------- | ------- | -------
```verbose``` | Optional | true | Gives you word level timestamps and score of each sentence.
```sentiment```| Optional | true | Give you [Sentiment Analysis](/docs/concepts/sentiment-analysis) on each message.