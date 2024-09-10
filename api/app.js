const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send-line-notify', async (req, res) => {
  try {
    // ใส่ Access Token ที่ถูกต้องที่นี่
    const token = 'Eo81uqgNj3DNz8PUKYjpkd59i7gFZWncPK2Cb9irg2x';
    const message = req.body.message;

    if (!message) {
      return res.status(400).send('Message is required');
    }

    const response = await axios.post('https://notify-api.line.me/api/notify', `message=${encodeURIComponent(message)}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      } 
    });

    res.status(200).send('Notification sent');
  } catch (error) {
    console.error('Error sending notification:', error.response ? error.response.data : error.message, error);
    res.status(500).send('Error sending notification');
  }
});

app.listen(3001, () => {
  console.log('Backend server running on http://localhost:3001');
});
