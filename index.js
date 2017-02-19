const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const tree = require('./Tree.js');

const staticPath = path.resolve(__dirname, './client');
const port = process.env.PORT || 9090;

let currentData;
let io;

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(staticPath));

const createHierarchy = obj => {
  let rootNodes = [];
  let unfixed = [];
  for (let prop in obj) {
    if (prop.endsWith('Par')) {
      let name = prop.slice(0, -3);
      if (obj[obj[prop]+'Par'] !== undefined) {
        unfixed.push(new tree.DoublyLinkedTree({name: name, pos: obj[name+'Pos'], rot: obj[name+'Rot']}));
      } else {
        rootNodes.push(new tree.DoublyLinkedTree({name: name, pos: obj[name+'Pos'], rot: obj[name+'Rot']}));
      }
    }
  }
  while(unfixed.length > 0) {
    unfixed.filter(node => {
      let parent = rootNodes.find(rootNode => rootNode.find(n => n.name === obj[node.name+"Par"]));
      if (parent) {
        parent.graft(node);
        return true;
      } else {
        return false;
      }
    });
  }
  return rootNodes;
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
  // currentData = createHierarchy(fix(req.body));
  currentData = fix(req.body);
  res.status(200).end();
  io.sockets.emit('current', {current: currentData});
});

let server = app.listen(port, () => {
  console.log('App is listening on port', port);
});

io = require('socket.io')(server);
io.on('connection', (socket) => {
  socket.emit('current', {current: currentData});
});


