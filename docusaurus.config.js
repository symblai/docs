require('dotenv').config()

module.exports = {
  plugins: [
    'docusaurus2-dotenv',
    'docusaurus-plugin-hotjar',
    'docusaurus-plugin-munchkin',
    'docusaurus-plugin-moesif',
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
        {
          to: '/telephony/introduction/', // string
          from: '/telephony/overview/introduction', // string | string[]
        },
        {
          to: '/streamingapi/introduction/', // string
          from: '/streamingapi/overview/introduction', // string | string[]
        },
        {
          to: '/javascript-sdk/introduction/', // string
          from: '/javascript-sdk/overview/introduction', // string | string[]
        },
        {
          to: '/javascript-sdk/code-snippets/connect-to-endpoints/', // string
          from: '/javascript-sdk/overview/connect-to-endpoints', // string | string[]
        },
        {
          to: '/javascript-sdk/code-snippets/active-speaker-events/', // string
          from: '/javascript-sdk/overview/active-speaker-events', // string | string[]
        },
        {
          to: '/javascript-sdk/code-snippets/subscribe-real-time/', // string
          from: '/javascript-sdk/overview/subscribe-real-time', // string | string[]
        },
        {
          to: '/javascript-sdk/code-snippets/streaming-audio-real-time/', // string
          from: '/javascript-sdk/overview/streaming-audio-real-time', // string | string[]
        },
        {
          to: '/telephony/tutorials/connect-to-zoom/', // string
          from: [
            '/telephony/guides/connect-to-zoom-with-telephony-api'
          ] // string | string[]
        },
        {
          to: '/telephony/tutorials/connect-to-phone-call/', // string
          from: [
            '/telephony/guides/get-live-transcription',
            '/telephony/tutorials/get-live-transcription'
          ] // string | string[]
        },
        {
          to: '/streamingapi/code-snippets/start-and-stop-connection/', // string
          from: '/streamingapi/code-snippets/start-and-stop-streaming-api-connection', // string | string[]
        },
        {
          to: '/streamingapi/tutorials/receive-ai-insights-from-your-web-browser/',
          from: [
            '/streamingapi/guides/get-realtime-transcription',
            '/streamingapi/tutorials/get-realtime-transcription'
          ]
        },
        {
          to: '/async-api/tutorials/get-speaker-separation-audio-video/',
          from: '/async-api/guides/get-speaker-separation-audio-video'
        },
        {
          to: '/javascript-sdk/tutorials/get-real-time-transcription-js-sdk/',
          from: [
            '/javascript-sdk/guides/get-realtime-transcription-js-sdk',
            '/javascript-sdk/tutorials/get-realtime-transcription-js-sdk'
          ]
        },
        {
          to: '/javascript-sdk/tutorials/pass-audio-codecs/',
          from: '/javascript-sdk/guides/pass-audio-codecs'
        },
        {
          to: '/javascript-sdk/tutorials/push-speakerevents-get-summary-url/',
          from: '/javascript-sdk/guides/push-speakerevents-get-summary-url'
        },
        {
          to: '/javascript-sdk/tutorials/receive-ai-insights-from-your-computer/',
          from: [
            '/javascript-sdk/guides/push-audio-get-realtime-data',
            '/javascript-sdk/tutorials/push-audio-get-realtime-data'
          ]
        }, {
          to: '/concepts/speech-to-text/',
          'from': '/conversation-api/concepts/speech-to-text'
        }, {
          to: '/concepts/action-items/',
          'from': '/conversation-api/concepts/action-items'
        }, {
          to: '/concepts/follow-ups/',
          'from': '/conversation-api/concepts/follow-ups'
        }, {
          to: '/concepts/topics/',
          'from': '/conversation-api/concepts/topics'
        }, {
          to: '/concepts/topic-hierarchy/',
          'from': '/conversation-api/concepts/topic-hierarchy'
        }, {
          to: '/concepts/sentiment-analysis/',
          'from': '/conversation-api/concepts/sentiment'
        }, {
          to: '/concepts/conversational-analytics/',
          'from': '/conversation-api/concepts/analytics'
        }, {
          to: '/conversation-api/action-items/',
          'from': [
            '/conversation-api/api-reference/action-items',
            '/conversation-api/overview/action-items'
          ]
        }, {
          to: '/conversation-api/analytics/',
          'from': [
            '/conversation-api/api-reference/analytics',
            '/conversation-api/overview/analytics'
          ]
        }, {
          to: '/conversation-api/conversation-data/',
          'from': [
            '/conversation-api/api-reference/conversation',
            '/conversation-api/overview/conversation'
          ]
        }, {
          to: '/conversation-api/delete-conversation/',
          'from': [
            '/conversation-api/api-reference/delete',
            '/conversation-api/overview/delete'
          ]
        }, {
          to: '/conversation-api/entities/',
          'from': [
            '/conversation-api/api-reference/entities',
            '/conversation-api/overview/entities'
          ]
        }, {
          to: '/conversation-api/follow-ups/',
          'from': [
            '/conversation-api/api-reference/follow-ups',
            '/conversation-api/overview/follow-ups'
          ]
        }, {
          to: '/conversation-api/insights/',
          'from': [
            '/conversation-api/api-reference/insights',
            '/conversation-api/overview/insights'
          ]
        }, {
          to: '/conversation-api/members/',
          'from': [
            '/conversation-api/api-reference/members',
            '/conversation-api/overview/members'
          ]
        }, {
          to: '/conversation-api/messages/',
          'from': [
            '/conversation-api/api-reference/messages',
            '/conversation-api/overview/messages'
          ]
        }, {
          to: '/conversation-api/questions/',
          'from': [
            '/conversation-api/api-reference/questions',
            '/conversation-api/overview/questions'
          ]
        }, {
          to: '/conversation-api/speaker-events/',
          'from': [
            '/conversation-api/api-reference/speakers',
            '/conversation-api/overview/speakers'
          ]
        }, {
          to: '/conversation-api/get-topics/',
          'from': [
            '/conversation-api/api-reference/topics',
            '/conversation-api/overview/topics'
          ]
        }, {
          to: '/conversation-api/transcript/',
          'from': [
            '/conversation-api/api-reference/transcript',
            '/conversation-api/overview/transcript'
          ]
        }, {
          to: '/conversation-api/update-members/',
          'from': [
            '/conversation-api/api-reference/update-members',
            '/conversation-api/overview/update-members'
          ]
        }]
      }
    ]
  ],
  title: 'Symbl Docs',
  tagline: 'Turning everyday conversations into actionable insights!',
  url: 'https://docs.symbl.ai',
  baseUrl: '/docs/',
  favicon: '/img/favicon.ico',
  organizationName: 'symbl.ai', // Usually your GitHub org/user-name.
  projectName: 'docs-v1', // Usually your repo name.
  onBrokenLinks: 'warn',
  themeConfig:
  {

    // Add a small bar on top of docs.
    // announcementBar: {
    //   id: 'support_us', // Any value that will identify this message.
    //   content:
    //     'We are looking to revamp our docs, please fill <a target="_blank" rel="noopener noreferrer" href="#">this survey</a>',
    //   backgroundColor: '#fafbfc', // Defaults to `#fff`.
    //   textColor: '#091E42', // Defaults to `#000`.
    //   isCloseable: false, // Defaults to `true`.
    // },
    //
    moesif: {
      applicationId: process.env.MOESIF_APPLICATION_ID,
      // Add other Moesif options here.
    },
    hotjar: {
      applicationId: process.env.HOTJAR_ID,
    },
    munchkin: {
      applicationId: process.env.MUNCHKIN_ID,
    },
    announcementBar: {
      id: 'new_docs_announcement', // Any value that will identify this message.
      content:'New Release Announcement: We have released the Symbl-Agora Marketplace extension with Agora SDK for Android applications. Head to our Integrations section to learn more.',
      backgroundColor: '#fafbfc', // Defaults to `#fff`.
      textColor: '#091E42', // Defaults to `#000`.
      isCloseable: true, // Defaults to `true`.
    },

    colorMode:
    {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true
    },
    "prism":
    {
      theme: require('prism-react-renderer/themes/palenight'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    navbar:
    {
      logo:
      {
        alt: 'Symbl Logo',
        src: '/img/symbl-logo-dark.webp',
        srcDark: '/img/symbl-logo-white.png'
      },
      items: [
        {
          label: "API Reference",
          to: '/api-reference/getting-started/',
          position: "left",
          activeBaseRegex: "docs/(api-reference|async-api/overview|streamingapi/introduction|streaming-api/api-reference|subscribe-api|telephony/introduction|telephony-api|conversation-api/api-reference|management-api|developer-tools/(authentication|error|postman|sample-apps))",
        }, 
        {
          label: "SDKs",
          to: '/sdk-intro/',
          position: "left",
          activeBaseRegex: "docs/(javascript-sdk|python-sdk|sdk-intro)"
        },
        {
          label: "Tutorials",
          to: '/tutorials/',
          position: "left",
          activeBaseRegex: "docs/(tutorials|streamingapi/(code-snippets|tutorials)|async-api/(code-snippets|tutorials)|telephony/(code-snippets|tutorials)|best-practices/best-practices-trackers)|pre-built-ui/(tuning-summary-page|custom-domain|user-engagement-analytics|supported-tracking-events)|concepts/(websockets|pstn-and-sip)"
        },            
        {
          label: "Integrations",
          to: '/integrations/integrations-intro/',
          position: "left",
          activeBaseRegex: 'docs/integrations'
        },
        {
          label: "Labs",
          to: '/labs/',
          position: "left",
          activeBaseRegex: "docs/(labs|conversation-api/comprehensive-action-items|concepts/redaction-pii|guides/abstract-topics-labs)"
        },
        {
          label: "Support",
          to: '/support/',
          position: "left",
        },
        {
          label: "Need help? Slack Us",
          href: 'https://symbldotai.slack.com/join/shared_invite/zt-4sic2s11-D3x496pll8UHSJ89cm78CA#/',
          position: "left",
        },
        {
          label: 'Free Sign Up',
          href: 'https://platform.symbl.ai/#/signup',
          position: "right",
        },
        {
          label: "🆕 Changelog",
          ImageData: "/img/tick-mark.png",
          to: '/changelog/',
          position: "right",
        },
      ],
    },

    algolia:
    {
      apiKey: process.env.ALGOLIA_KEY,
      indexName: process.env.ALGOLIA_INDEX_NAME,
      appId: process.env.ALGOLIA_APP_ID
      //      contextualSearch: true,
    },

    footer:
    {
      style: 'dark',
      links: [
        {
          title: 'Resources',
          items: [

            {
              label: 'Free Sign Up',
              to: 'https://platform.symbl.ai/#/signup',
            },

            {
              label: 'Blog',
              to: 'https://symbl.ai/blog',
            },

          ],
        },
        {
          title: 'Community',
          items: [
          {
            label: 'Developer Slack',
            href: 'https://symbldotai.slack.com/join/shared_invite/zt-4sic2s11-D3x496pll8UHSJ89cm78CA#/',
          },
          {
            label: 'Videos',
            href: 'https://www.youtube.com/channel/UCpqOyNdFI0kASCZL-eCnkcA/videos',
          }, ],
        },

      ],
      copyright: `© ${new Date().getFullYear()} Symbl.ai All rights reserved.`,
    }
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        googleAnalytics: {
          trackingID: process.env.GOOGLE_ANALYTICS_TRAKING_ID,
          anonymizeIP: true,
        },
        gtag: {
          trackingID: process.env.GTAG_ID,
          // Optional fields.
          anonymizeIP: true, // Should IPs be anonymized?
        },
        docs:
        {
          // It is recommended to set document id as docs home page (`docs/` path).
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl: ({docPath}) => {
            return `https://github.com/symblai/documentation/edit/master/docs/${docPath}`;
          }
        },
        blog:
        {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/symblai',
        },
        theme:
        {
          customCss: require.resolve('./src/css/custom.css'),
        }
      }
    ]
  ]
};
