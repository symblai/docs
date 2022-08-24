---
id: receive-live-topics
title: Receive Live Topics
slug: /streamingapi/code-snippets/receive-live-topics/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

---

This example goes over how you can use the Symbl Streaming API to receive [Topics](/docs/concepts/topics), which are what the Symbl API determines to be the most important keywords or phrases used in a conversation. This example uses both the [Symbl's Javascript SDK](/docs/javascript-sdk/overview/introduction), which is meant to be run using Node.js, and native Javascript which can be run in the browser: 

## Connect

The first thing we do is connect to the Web Socket. If you're using the SDK you can use [`onTopicResponse`](#ontopicresponse) handler after the connection is established, otherwise you'll have to parse the response in the `onmessage` callback for the WebSocket.

<Tabs
  defaultValue="nodejs"
  values={[
    { label: 'Symbl SDK (Node.js)', value: 'nodejs' },
    { label: 'Native Javascript', value: 'javascript' }
  ]
}>
<TabItem value="nodejs">

```js
const {sdk} = require('symbl-node');
const uuid = require('uuid').v4;

(async () => {
  try {
    // Initialize the SDK. You can find the appId and appSecret at https://platform.symbl.ai.
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
        sampleRateHertz: 44100,
      },
      speaker: {
        // Optional, if not specified, will simply not send an email in the end.
        userId: 'emailAddress', // Update with valid email
        name: 'My name'
      },
      handlers: {
        /**
         * When Symbl detects a topic, this callback will be called.
         */
        onTopicResponse: (data) => {
          console.log('onTopicResponse', JSON.stringify(data, null, 2));
          // The topic is found in data.phrase.
          console.log('Topic:', data.phrase);
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
})();

```

#### Connect Mic

After you connect, you want to connect to your device's microphone. This code is inserted after the `connection` and before the closing of the `try...catch`

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
```

#### Testing

Create a javascript file named `app.js` and copy this code into the file. Fill in the placeholder values with the proper values. Use npm to install the required libraries: `npm install symbl-node uuid`. Now in the terminal run

```bash
$ node app.js
```

If successful you should receive a response in the console.

</TabItem>

<TabItem value="javascript">

```js
const accessToken = accessToken;
// Refer to the Authentication section for how to generate the accessToken: https://docs.symbl.ai/docs/developer-tools/authentication
const uniqueMeetingId = btoa("user@example.com");
const symblEndpoint = `wss://api.symbl.ai/v1/streaming/${uniqueMeetingId}?access_token=${accessToken}`;

const ws = new WebSocket(symblEndpoint);

ws.onmessage = (event) => {
  // You can find the conversationId in event.message.data.conversationId;
  const data = JSON.parse(event.data);
  if (data.type === 'message' && data.message.hasOwnProperty('data')) {
    console.log('conversationId', data.message.data.conversationId);
  }
  if (data.type === 'topic_response') {
    for (let topic of data.topics) {
      console.log('topic:', topic.phrases)
    }
  }
  console.log('event', event);
  console.log('Parsed Object', JSON.stringify(data, null, 2));
};

// Fired when the WebSocket closes unexpectedly due to an error or lost connetion
ws.onerror  = (err) => {
  console.error(err);
};

// Fired when the WebSocket connection has been closed
ws.onclose = (event) => {
  console.info('Connection to websocket closed');
};

// Fired when the connection succeeds.
ws.onopen = (event) => {
  ws.send(JSON.stringify({
    type: 'start_request',
    meetingTitle: 'Websockets How-to', // Conversation name
    insightTypes: ['question', 'action_item'], // Will enable insight generation
    config: {
      confidenceThreshold: 0.5,
      languageCode: 'en-US',
      speechRecognition: {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100,
      }
    },
    speaker: {
      userId: 'example@symbl.ai',
      name: 'Example Sample',
    }
  }));
};
```
:::note Backward Compatibility
The previous endpoint  `wss://api.symbl.ai/v1/realtime/insights/` is now updated to `wss://api.symbl.ai/v1/streaming/` to standardize our API nomenclature. This change is backward compatible. However, we recommend you to use the new endpoint. 
:::

#### Connect Mic

After you connect, you want to connect to your device's microphone. This code is inserted after the `ws.onopen` function:

```js
const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

/**
 * The callback function which fires after a user gives the browser permission to use
 * the computer's microphone. Starts a recording session which sends the audio stream to
 * the WebSocket endpoint for processing.
 */
const handleSuccess = (stream) => {
  const AudioContext = window.AudioContext;
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const processor = context.createScriptProcessor(1024, 1, 1);
  const gainNode = context.createGain();
  source.connect(gainNode);
  gainNode.connect(processor);
  processor.connect(context.destination);
  processor.onaudioprocess = (e) => {
    // convert to 16-bit payload
    const inputData = e.inputBuffer.getChannelData(0) || new Float32Array(this.bufferSize);
    const targetBuffer = new Int16Array(inputData.length);
    for (let index = inputData.length; index > 0; index--) {
        targetBuffer[index] = 32767 * Math.min(1, inputData[index]);
    }
    // Send audio stream to websocket.
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(targetBuffer.buffer);
    }
  };
};


handleSuccess(stream);
```

#### Testing

Open up your browser's development environment and copy this code into the console. Replace the placeholder values with the proper values.

If successful you should receive a response in the console.

</TabItem>
</Tabs>

<a name="ontopicresponse"></a>

### Query Params

Following are the optional query parameters that you can pass in this API:

Parameter | Required | Value |Description |
--------- | --------- | ------- | -------
```verbose``` | Optional | true | Gives you word level timestamps and score of each sentence.
```sentiment```| Optional | true | Give you [Sentiment Analysis](/docs/concepts/sentiment-analysis) on each message.

### Handlers Reference

* `handlers`: This object has the callback functions for different events

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

## See Also

- [Receive live captioning](/docs/streamingapi/code-snippets/receive-live-captioning)
- [Receive live insights](/docs/streamingapi/code-snippets/receive-live-insights)