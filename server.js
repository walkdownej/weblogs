const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();

// Middleware to parse JSON and text payloads
app.use(express.json());
app.use(express.text());

// Endpoint to log webhook requests
app.post('/log', async (req, res) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    headers: req.headers,
    body: req.body,
    query: req.query
  };

  // Log to file
  try {
    fs.appendFileSync('webhook.log', JSON.stringify(logEntry, null, 2) + '\n');
    console.log('Logged request:', logEntry);
  } catch (err) {
    console.error('Error writing to log:', err);
  }

  // Optionally forward to the original webhook
  try {
    await axios.post('https://discord.com/api/webhooks/1397128931567603742/ICteuf__9KOTzicVn7lysg7AFbe16q7o2lebabbArWxq-t9bHrfPCbbiVY3zLZTJI9xT', req.body, {
      headers: req.headers
    });
    console.log('Forwarded to original webhook');
  } catch (err) {
    console.error('Error forwarding request:', err.message);
  }

  // Respond to the webhook sender
  res.sendStatus(200);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
