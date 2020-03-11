const axios = require('axios').default;

async function getUserByZankId(id) {
  try {
    const response = await axios.get('users', { baseURL: process.env.BASE_URL, params: { zankid: id } });
    return response.data.users[0];
  } catch (error) {
    return {};
  }
}

async function getUserBySlackId(id) {
  try {
    const response = await axios.get('users', { baseURL: process.env.BASE_URL, params: { slackid: id } });
    return response.data.users[0];
  } catch (error) {
    return {};
  }
}

module.exports = { getUserByZankId, getUserBySlackId };
