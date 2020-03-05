const { createEventAdapter } = require('@slack/events-api');

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

slackEvents.on('url_verification', (event, body) => {
  console.log(event);
  console.log(body);
});

slackEvents.on('app_mention', event => {
  console.log('mention :');
  console.log(event);
});

slackEvents.on('message', (event, body) => {
  console.log(event);
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
  console.log('body : ', body);
});

slackEvents.on('error', console.error);

module.exports = slackEvents;
