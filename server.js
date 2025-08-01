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
    await axios.post('https://l.webhook.party/hook/1xAhO58c9OQ9HvdARJ1ALxCECIgPSUU0MSzWxwJHjb8lgTM1zXk6E5MEsCno97549o5XTqVfCX4i4mtuSEBHEwWvY6yAvQuNLHIr9agO9ituVxjPkVR8EdE7Uj5LP0aEeYSqhmRm40fte65mochwUnjyDak72j17rn9Ewud%2BIHzaPLqi6XHDP8%2B%2F7UO%2FA168iISyCBDgvyFCBHn%2FQiSdoBQk0LNJgtBY1HL7gtT2zXgIRkJaZhGORwpI8XAR2YOZyxw4mY2qs2XwPZ4wcfvhHDh3bQKU8dAPtYnEcMbjMUIjm9%2FWd64G2qExLYU66SiAV%2BY5mu4hGD4zGKl2sLuZzOl%2BZbH%2BUI6Wr1ol85VWexSgQGNpF3x0QCvGtziaH4WEQarqZvQYH2A%3D/66SBmIIo8EOCGU6b', req.body, {
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
