const axios = require('axios').default;
const userHelper = require('../helpers/users');

const commandHandlers = {
  '/slank-bh': handlerBancoHoras
};

function commands(req, res, next) {
  if (req.body.command in commandHandlers) {
    commandHandlers[req.body.command](req, res);
  }
  next();
}

function hoursToString(hours) {
  const hoursABS = Math.abs(hours);
  const days = Math.floor(hoursABS / 8.8);
  const valueMinusDays = hoursABS / 8.8 - days;

  const rhours = Math.floor(valueMinusDays * 8.8);
  const minutes = Math.round((valueMinusDays * 8.8 - rhours) * 60);

  const phrase = hours < 0 ? 'Você tem um débito de ' : 'Você tem um crédito de ';
  return `${phrase} ${hours}. \n 
          Isso corresponde a : ${days.toString().padStart(2, '0')} dias ${rhours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')} hrs.`;
}

function handlerBancoHoras(req, res) {
  let { response_url } = req.body;
  res.status(200).send();

  setTimeout(async () => {
    const user = await userHelper.getUserBySlackId(req.body.user_id);
    console.log(req.body);
    console.log('----------------------------');
    console.log(user);
    console.log('----------------------------');
    console.log(response_url);
    try {
      await axios.post(response_url, { text: hoursToString(user.saldo) });
    } catch (error) {
      console.log(error);
    }
  }, 10);
}

module.exports = commands;
