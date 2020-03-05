const { WebClient } = require('@slack/web-api');
const express = require('express');
const web = new WebClient(process.env.SLACK_TOKEN);

const router = express.Router();

router.get('/lanche', async (req, res) => {
  const channel = 'bots';
  const hoje = new Date().getDate();
  let turma = hoje % 2 === 0 ? '01' : '02';
  let text = `Turma ${turma} - Lanche ! :baguette_bread:`;

  const result = await web.chat.postMessage({ channel, text });

  setTimeout(async () => {
    turma = turma === '01' ? '02' : '01';
    text = `Turma ${turma} - Lanche ! :baguette_bread:`;
    await web.chat.postMessage({ channel, text });
  }, 1000 * 60 * 1);

  res.status(200).json(result);
});

module.exports = router;
