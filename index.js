const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const staticPath = path.resolve(__dirname, './client');
const port = process.env.PORT || 9090;

let currentData;
let io;

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(staticPath));

const createHierarchy = obj => {
  let filtered = {};
  for (let prop in obj) {
    if (prop.endsWith('Par')) {
      let newElem = prop.slice()
    }
  }
}

const fix = data => {
  let result = {};
  for (let prop in data) {
    if (prop.endsWith('Pos')) {
      result[prop] = data[prop].slice(1,-1).split(', ').map(Number);
    } else if (prop.endsWith('Rot')) {
      result[prop] = data[prop].slice(1, -1).split(', ').map(Number);
    } else {
      result[prop] = data[prop];
    }
  }
  return result;
}

app.post('/data', (req, res) => {
  currentData = fix(req.body);
  res.status(200).end();
  console.log(currentData);
  io.sockets.emit('current', {current: currentData});
});

let server = app.listen(port, () => {
  console.log('App is listening on port', port);
});

io = require('socket.io')(server);
io.on('connection', (socket) => {
  socket.emit('current', {current: currentData});
});


