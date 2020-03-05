const { WebClient } = require('@slack/web-api');
const express = require('express');
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
  const channel = req.body.channel || 'bots';

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

module.exports = router;
