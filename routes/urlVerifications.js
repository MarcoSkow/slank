const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { challenge, type } = req.body;

  if (!type || type !== 'url_verification') {
    return res.status(400).json({ error: 'challeng_failed' });
  }

  return res.status(200).json({ challenge });
});

module.exports = router;
