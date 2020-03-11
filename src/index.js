require('dotenv').config();

const http = require('http');
const express = require('express');

const slackEvents = require('./events/events');
const webapi = require('./webClient/index');
const urlVerificarion = require('./routes/urlVerifications');
const slashCommands = require('./commands/commands');

const app = express();
app.use('/slack/events', slackEvents.expressMiddleware());
app.post('/slack/commands', express.urlencoded({ extended: false }), slashCommands);

app.use(express.json(), express.urlencoded({ extended: false }));

app.use('/', urlVerificarion);
app.use('/slack/webapi', webapi);

const port = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Slank Bot ativo, escutando a porta : ${port}`);
});
