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

function handlerBancoHoras(req, res) {
  let { response_url } = req.body;
  res.status(200).send();

  setTimeout(async () => {
    const user = await userHelper.getUserBySlackId(req.body.user_id);
    console.log(req.body);
    console.log('----------------------------');
    console.log(user);
    console.log('----------------------------');
    response_url = response_url.replace('https', 'http');
    console.log(response_url);
    try {
      const response = await axios.post(response_url, { text: 'hoje tem gol do Gabigol !' });
    } catch (error) {
      console.log(error);
    }
  }, 10);

  // (async () => {
  //   axios
  //     .post(req.body.response_url, {
  //       text: `Seu saldo é de : ${user.saldo}`
  //     })
  //     .catch(console.error);
  // })();
}

module.exports = commands;
