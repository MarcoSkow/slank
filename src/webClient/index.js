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
  const { solicitacaoId, sistema, cliente, atendimento, usuarioId } = req.body;

  if (!usuarioId) {
    return res.status(400).json({ ok: false, message: 'usuarioId não informado ou incorreto.' });
  }

  let response;
  let user;

  try {
    response = await axios.get('http://us-east1-siacbancohoras.cloudfunctions.net/api/v1/users');
    user = response.data.users.filter(user => user.zankId === usuarioId)[0];
  } catch (error) {
    return res.status(400).json({ ok: false, message: 'usuarioId não localizado!' });
  }

  let blocks = [
    {
      type: 'section',
      text: {
        text: `_Olá <@${user.slackId}>!_ *Uma solicitação do ZANK foi encaminhada pra você.*`,
        type: 'mrkdwn'
      },
      fields: []
    }
  ];

  blocks[0].fields.push({ type: 'mrkdwn', text: '*Solicitação*' });
  blocks[0].fields.push({ type: 'mrkdwn', text: '*Sistema*' });
  blocks[0].fields.push({ type: 'plain_text', text: `${solicitacaoId}` });
  blocks[0].fields.push({ type: 'plain_text', text: sistema });

  blocks[0].fields.push({ type: 'mrkdwn', text: '*Cliente*' });
  blocks[0].fields.push({ type: 'mrkdwn', text: '*Siac Atendimento*' });
  blocks[0].fields.push({ type: 'plain_text', text: cliente });
  blocks[0].fields.push({ type: 'plain_text', text: `${atendimento}` });

  const result = await web.chat.postMessage({ channel: user.slackId, blocks });

  res.status(200).json(result);
});

module.exports = router;
