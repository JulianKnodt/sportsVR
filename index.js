const express = require('express');
const app = express();
const path = require('path');

const staticPath = path.resolve(__dirname, './client');
const port = process.env.PORT || 9090;


app.use(express.static(staticPath));

app.post('/data', (req, res) => {
  const data = req.body;
  res.status(200).end();
});

app.listen(port, () => {
  console.log('App is listening on port', port);
});