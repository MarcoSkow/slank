const { WebClient } = require('@slack/web-api');
const express = require('express');
const axios = require('axios').default;

const web = new WebClient(process.env.SLACK_TOKEN);
const router = express.Router();

const emojis = [
  ':baguette_bread:',
  ':avocado:',
  ':bacon:',
  ':stuffed_flatbread:',
  ':peanuts:',
  ':fortune_cookie:',
  ':egg:',
  ':sandwich:',
  ':yum:',
  ':cut_of_meat:',
  ':meat_on_bone:'
];

const rand = (min, max) => Math.floor(Math.random() * max) + min;

router.post('/lanche', async (req, res) => {
  const channel = req.body.channel || process.env.GROUP_CHANNEL || 'bots';

  const hoje = new Date().getDate();

  let turma = hoje % 2 === 0 ? '01' : '02';

  let emoji = rand(0, emojis.length);

  let text = `${emojis[emoji]}  Turma ${turma} - Lanche !  ${emojis[emoji]}`;

  const result = await web.chat.postMessage({ channel, text });

  setTimeout(async () => {
    turma = turma === '01' ? '02' : '01';
    text = `${emojis[emoji]}  Turma ${turma} - Lanche !  ${emojis[emoji]}`;
    await web.chat.postMessage({ channel, text });
  }, 1000 * 60 * process.env.LANCHE_INTERVAL);

  res.status(200).json(result);
});

router.post('/notify', async (req, res) => {
  const { resumo, solicitacaoId, sistema, cliente, atendimento, usuarioId, urgente, status } = req.body;

  if (!usuarioId) {
    return res.status(400).json({ ok: false, message: 'usuarioId não informado ou incorreto.' });
  }

  let response;
  let user;

  try {
    response = await axios.get('http://us-east1-siacbancohoras.cloudfunctions.net/api/v1/users', { params: { zankid: usuarioId } });
    user = response.data.users[0];
  } catch (error) {
    return res.status(400).json({ ok: false, message: 'usuarioId não localizado!' });
  }

  if (!user) {
    return res.status(400).json({ ok: false, message: 'Relacionamento entre ID do Zank e ID do Slack não encontrado.' });
  }

  const color = urgente === 'S' ? '#ff0000' : '#952ef3';
  const thumb_url =
    urgente === 'S'
      ? 'https://firebasestorage.googleapis.com/v0/b/siacbancohoras.appspot.com/o/slank%2Furgente.png?alt=media&token=b8134266-1830-4fd8-a0af-d57770f5dd83'
      : 'http://placeimg.com/256/256/tech';

  let attachments = [
    {
      mrkdwn_in: ['text'],
      // color: '#36a64f',
      color,
      pretext: `_Olá <@${user.slackId}>!_ *Uma solicitação do ZANK foi encaminhada pra você.*`,
      author_name: 'Slank-Bot',
      author_link: 'https://siacsistemas.slack.com/team/UUU8AA42J',
      author_icon: 'http://placeimg.com/128/128/people',
      title: 'Resumo',
      // title_link: 'https://api.slack.com/',
      text: '```' + `${resumo || 'Resumo da solicitação não informado'}` + '```',
      fields: [],
      thumb_url,
      footer: 'footer',
      footer_icon: 'https://platform.slack-edge.com/img/default_application_icon.png',
      ts: Date.now()
    }
  ];

  attachments[0].fields.push({ title: 'Solicitação', value: +solicitacaoId, short: true });
  attachments[0].fields.push({ title: 'Siac Atendimento', value: +atendimento, short: true });
  attachments[0].fields.push({ title: 'Cliente', value: cliente });
  attachments[0].fields.push({ title: 'Sistema', value: sistema });
  attachments[0].fields.push({ title: 'Status', value: status });

  const result = await web.chat.postMessage({ channel: user.slackId, attachments });

  res.status(200).json(result);
});

module.exports = router;
