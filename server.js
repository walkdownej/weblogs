const express = require('express');
const axios = require('axios');
const app = express();

// Store logs in memory (array)
let requestLogs = [];

// Middleware to parse JSON and text
app.use(express.json());
app.use(express.text());

// POST endpoint to log webhook requests
app.post('/log', async (req, res) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    headers: req.headers,
    body: req.body,
    query: req.query
  };

  // Store in memory (limit to 100 logs to avoid memory issues)
  requestLogs.push(logEntry);
  if (requestLogs.length > 100) requestLogs.shift();

  console.log('Logged request:', logEntry);

  // Optional: Forward to original webhook
  try {
    await axios.post('https://discord.com/api/webhooks/1397128931567603742/ICteuf__9KOTzicVn7lysg7AFbe16q7o2lebabbArWxq-t9bHrfPCbbiVY3zLZTJI9xT', req.body, {
      headers: req.headers
    });
    console.log('Forwarded to original webhook');
  } catch (err) {
    console.error('Error forwarding:', err.message);
  }

  res.sendStatus(200);
});

// GET endpoint to retrieve logs
app.get('/logs', (req, res) => {
  res.json(requestLogs);
});

// Debug route to confirm server is running
app.get('/', (req, res) => {
  res.send('Webhook logger is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
