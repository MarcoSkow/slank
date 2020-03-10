const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/web-api');

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const web = new WebClient(process.env.SLACK_TOKEN);

const USER_ADMIN = 'UHFEWMZGD';
const USER_BOT = 'UUU8AA42J';

slackEvents.on('url_verification', (event, body) => {
  console.log(event);
  console.log(body);
});

slackEvents.on('app_mention', async event => {
  console.log('mention :');
  console.log(event);

  if (event.type !== 'app_mention') {
    return;
  }

  await botInteractive(event);
});

slackEvents.on('message', async (event, body) => {
  console.log('message');
  console.log('event :', event);
  console.log('body : ', body);

  if (event.bot_profile) {
    return;
  }

  await botInteractive(event);
});

slackEvents.on('error', console.error);

module.exports = slackEvents;

async function botInteractive(event) {
  const textWithoutUser = event.text.replace(`<@${USER_BOT}>`, '');
  const user = `<@${event.user}>`;
  const channel = event.channel;
  let msg = `Olá ${user}. Não entendi o que você deseja. Ainda estou aprendendo...`;

  if (textWithoutUser.toLowerCase().includes('olá')) {
    msg = `Olá ${user} ! \nComo posso ajudar ?`;
  } else if (textWithoutUser.toLowerCase().includes('bom dia')) {
    msg = `Bom dia ${user} ! \nComo posso ajudar ?`;
  } else if (textWithoutUser.toLowerCase().includes('boa tarde')) {
    msg = `Boa tarde ${user} ! \nComo posso ajudar ?`;
  } else if (textWithoutUser.toLowerCase().includes('boa noite')) {
    msg = `Boa noite ${user} ! \nComo posso ajudar ?`;
  } else {
    await web.chat.postMessage({ channel: USER_ADMIN, text: `${user} enviou uma mensagem ao slank : \n ${event.text}` });
  }
  const result = await web.chat.postMessage({ channel, text: msg });
}
