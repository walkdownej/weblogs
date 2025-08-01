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
    await axios.post('https://l.webhook.party/hook/1xAhO58c9OQ9HvdARJ1ALxCECIgPSUU0MSzWxwJHjb8lgTM1zXk6E5MEsCno97549o5XTqVfCX4i4mtuSEBHEwWvY6yAvQuNLHIr9agO9ituVxjPkVR8EdE7Uj5LP0aEeYSqhmRm40fte65mochwUnjyDak72j17rn9Ewud%2BIHzaPLqi6XHDP8%2B%2F7UO%2FA168iISyCBDgvyFCBHn%2FQiSdoBQk0LNJgtBY1HL7gtT2zXgIRkJaZhGORwpI8XAR2YOZyxw4mY2qs2XwPZ4wcfvhHDh3bQKU8dAPtYnEcMbjMUIjm9%2FWd64G2qExLYU66SiAV%2BY5mu4hGD4zGKl2sLuZzOl%2BZbH%2BUI6Wr1ol85VWexSgQGNpF3x0QCvGtziaH4WEQarqZvQYH2A%3D/66SBmIIo8EOCGU6b', req.body, {
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
