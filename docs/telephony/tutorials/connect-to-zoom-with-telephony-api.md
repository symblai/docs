---
id: connect-to-zoom-with-telephony-api
title: Real Time AI insights From Zoom Call
slug: /telephony/tutorials/connect-to-zoom/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

---

:::info
This guide uses a **PSTN** connection to connect to Zoom. **PSTN** audio quality maxes out to 8KHz. You can also use a **[SIP-based connection](/docs/concepts/pstn-and-sip#sip-session-initiation-protocol)**, which captures audio at 16KHz and above.
:::

[Symbl’s Telephony API](/docs/telephony/introduction) allows you to connect to any conference call system using PSTN or SIP networks. In this guide, we will walk you through how to get a live transcription and real-time AI insights, such as [follow-ups](/docs/concepts/follow-ups), [action items](/docs/concepts/action-items), [topics](/docs/concepts/topics) and [questions](/docs/conversation-api/questions), of a Zoom call using a PSTN connection. This application uses the Symbl Javascript SDK which requires the `@symblai/symbl-js` node package. You must have an active Zoom call (no one has to be in it but yourself) and whatever you speak in the Zoom call will be taken by our API and processed for conversational insights.

:::info
You must make sure your Zoom call allows phone dial-in for this example to work correctly.
:::


## Contents

* [Getting Started](#getting-started)
* [Set Up Symbl SDK](#set-up-symbl-sdk)
  * [Retreive your Symbl API credentials](#retrieve-your-symbl-api-credentials)
  * [Initialize SDK](#initialize-sdk)
* [Connect to Zoom](#connect-to-zoom)
* [Grabbing the Conversation ID](#grabbing-the-conversation-id)
* [Full Code Sample](#full-code-sample)
  * [Test](#test)
* [Query Params](#query-params)
* [Conclusion](#conclusion)


## Getting Started

In this example we use the following variables which you must replace in the code examples for the code to work:

Key | Type | Description
---------- | ------- | ------
`appId` | String | The application ID you get from the home page of the platform.
`appSecret` | String | The application secret you get from the home page of the platform.

## Set Up Symbl SDK

To get started, you’ll need your account credentials and [Node.js](https://nodejs.org/en/download/) installed (> v8.x) on your machine.

We’ll use the [Symbl module for Node.js](https://www.npmjs.com/package/@symblai/symbl-js) in this guide. Make sure you have a Node project set up. If you don’t have one, you can set one up using [npm init](https://docs.npmjs.com/cli/init).

From the root directory of your project, run the following command to add `@symblai/symbl-js` in your project dependencies.

```bash
npm i --save @symblai/symbl-js
```
### Authentication
Before using this API, you must generate your authentication token (`AUTH_TOKEN`). To learn how to get the authentication token, see the [Authentication](/docs/developer-tools/authentication) page.

### Retrieve your Symbl API credentials

Your credentials include your App ID and App Secret, which you can find on the home page of the [platform](https://platform.symbl.ai/#/login).
![credentials page](/img/credentials.png)


### Initialize SDK

Create a new file named index.js in your project and add the following lines to initialize the Symbl SDK:

```javascript
const {sdk, SpeakerEvent} = require("@symblai/symbl-js");
const appId = appId;
const appSecret = appSecret;

sdk.init({
  appId: appId,
  appSecret: appSecret,
  basePath: "https://api.symbl.ai",
}).then(async() => {
  console.log('SDK initialized.');
  try {
    // Connect to zoom here
  } catch (e) {
    console.error(e);
  }
}).catch(err => console.error('Error in SDK initialization.', err));
```


## Connect to Zoom

To connect to a Zoom call you need something called a DTMF Sequence. *In simple terms, a DTMF sequence is the dial-pad keys you press after calling into a Zoom call.* They consist of any key you find on a telephone keypad and commas (`,`), which add a bit of artificial delay between key presses; with one comma being 500ms. Typically we add a bit of artificial delay after the pound key is pressed to give the conference call time to process which keys were pressed.

For Zoom a DTMF Sequence is made up of two items:

* The Zoom Meeting ID ([read here](https://support.zoom.us/hc/en-us/articles/201362193-Joining-a-meeting) for information on what the Zoom Meeting ID is.)
* The Zoom Participant ID (optional). This is uncommon. If the Zoom Meeting requires a participant ID, set it as the value of the `ZOOM_PARTICIPANT_ID` variable. [Read more here](https://support.zoom.us/hc/en-us/articles/201362663-Joining-a-meeting-or-webinar-by-phone).
* The Zoom Meeting Passcode (optional). If there is no Zoom Meeting Passcode just make the variable an empty string.

:::info
If your Zoom call has a passcode you must set it to be all numerical digits.
:::

View the [Telephony API documentation](/docs/telephony/overview/post-api) to see the various configuration options.


```js
const phoneNumber = ""; // US Zoom Numbers are "+16465588656", or "+14086380968".
const meetingName = "Zoom Test Meeting";
const emailAddress = "user@example.com";

const ZOOM_MEETING_ID = "ZOOM_MEETING_ID";
const ZOOM_PARTICIPANT_ID = "";
const ZOOM_MEETING_PASSCODE = "";

let dtmfSequence = `${ZOOM_MEETING_ID}#`;

if (ZOOM_PARTICIPANT_ID) {
  dtmfSequence += `,,${ZOOM_PARTICIPANT_ID}#`;
} else {
  dtmfSequence += `,,#`;
}

if (ZOOM_MEETING_PASSCODE) {
  dtmfSequence += `,,${ZOOM_MEETING_PASSCODE}#`;
}


sdk.startEndpoint({
  endpoint: {
    type: "pstn",
    phoneNumber: phoneNumber,
    dtmf: dtmfSequence,
  },
  actions: [
    {
      invokeOn: "stop",
      name: "sendSummaryEmail",
      parameters: {
        emails: [
          emailAddress
        ],
      },
    },
  ],
  data: {
    session: {
      name: meetingName,
    },
  },
}).then((connection) => {
  const connectionId = connection.connectionId;
  console.log('connection', connection);
  console.log("Successfully connected.", connectionId);
  console.log('Full Conection Object', JSON.stringify(connection, null, 2));
  console.log("Calling into Zoom now, please wait about 30-60 seconds.");
})
.catch((err) => {
   console.error("Error while starting the connection", err);
});
```

Once the connection is established Symbl will call into your Zoom conference. Be patient, as this can take up to a minute in some cases. Once Symbl has connected to the call you will get a request to allow them in.

## Grabbing the Conversation ID

The Conversation ID is very useful for our other APIs such as the [Conversation API](/docs/conversation-api/introduction). Using the Conversation API is how you get AI insights after the call is over. We don't use it in this example because it's mainly used for non-real-time data gathering, but it's good to know how to grab it as you can use the Conversation ID later to extract the conversation AI insights.

If you look closely at the success callback for `sdk.startEndpoint()` promise, you can grab the Conversation ID like this:


```js
const conversationId = connection.conversationId;
```

With the Conversation ID you can do each of the following (and more!):

**[View conversation topics](/docs/conversation-api/get-topics)**<br />
Summary topics provide a quick overview of the key things that were talked about in the conversation.

**[View action items](/docs/conversation-api/action-items)**<br />
An action item is a specific outcome recognized in the conversation that requires one or more people in the conversation to take a specific action, e.g. set up a meeting, share a file, complete a task, etc.

**[View follow-ups](/docs/conversation-api/follow-ups)**<br />
This is a category of action items with a connotation to follow-up a request or a task like sending an email or making a phone call or booking an appointment or setting up a meeting.

## Full Code Sample

Here's the full Code Sample below:

```js
const {sdk, SpeakerEvent} = require("@symblai/symbl-js");
const appId = appId;
const appSecret = appSecret;
const phoneNumber = ""; // US Zoom Numbers are "+16465588656", or "+14086380968".
const meetingName = "Zoom Test Meeting";
const emailAddress = "user@example.com";

const ZOOM_MEETING_ID = "ZOOM_MEETING_ID";
const ZOOM_PARTICIPANT_ID = "";
const ZOOM_MEETING_PASSCODE = "";

let dtmfSequence = `${ZOOM_MEETING_ID}#`;

if (ZOOM_PARTICIPANT_ID) {
  dtmfSequence += `,,${ZOOM_PARTICIPANT_ID}#`;
} else {
  dtmfSequence += `,,#`;
}

if (ZOOM_MEETING_PASSCODE) {
  dtmfSequence += `,,${ZOOM_MEETING_PASSCODE}#`;
}

sdk.init({
  appId: appId,
  appSecret: appSecret,
  basePath: "https://api.symbl.ai",
}).then(async() => {
  console.log('SDK initialized.');
  try {

    sdk.startEndpoint({
      endpoint: {
        type: "pstn",
        phoneNumber: phoneNumber,
        dtmf: dtmfSequence,
      },
      actions: [
        {
          invokeOn: "stop",
          name: "sendSummaryEmail",
          parameters: {
            emails: [
              emailAddress
            ],
          },
        },
      ],
      data: {
        session: {
          name: meetingName,
        },
      },
    }).then((connection) => {
      const connectionId = connection.connectionId;
      console.log("Successfully connected.", connectionId);
      console.log('Conversation ID', connection.conversationId);
      console.log('Full Conection Object', connection);
      console.log("Calling into Zoom now, please wait about 30-60 seconds.");

      // Scheduling stop endpoint call after 60 seconds
      setTimeout(() => {
        sdk.stopEndpoint({
          connectionId: connection.connectionId
        }).then(() => {
          console.log('Stopped the connection with connectionID:', connectionId);
          console.log('Conversation ID for Stopped Connection:', connection.conversationId);
          console.log('Full Stop Conection Object:', connection);
        }).catch(err => console.error('Error while stopping the connection.', err));
      }, 60000);
    })
    .catch((err) => {
       console.error("Error while starting the connection", err);
    });
  } catch (e) {
    console.error(e);
  }
}).catch(err => console.error('Error in SDK initialization.', err));
```

### Test
To verify and check if the code is working:

Run your code:
```bash
$ node index.js
```
### Query Params

Following are the optional query parameters that you can pass in this API:

Parameter | Required | Value |Description |
--------- | --------- | ------- | -------
```verbose``` | Optional | true | Gives you word level timestamps and score of each sentence.
```sentiment```| Optional | true | Give you [Sentiment Analysis](/docs/concepts/sentiment-analysis) on each message.

## Conclusion

And that's it! Once Symbl is connected to the call, the API will take in your conversation and work its magic. Once the call is over, the email address specified will be sent a summary of the conversation which includes a full-text transcript, action items and conversational insights. You can also use the Conversation ID returned from the connection to perform even more tasks using our [Conversation API](/docs/conversation-api/introduction).

:::info Termination due to elongated silence
If the meeting is silent for more than 30 minutes, it will be automatically terminated. The charges towards the silent minutes apply. 
:::
