const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const tree = require('./Tree.js');
const exJSON = require('exjson');
const DataDelegate = require('./dataDelegate');
const staticPath = path.resolve(__dirname, './client');
const port = process.env.PORT || 9090;

let dataDelegate = new DataDelegate();
let currentData = [];
let io;

// app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.urlencoded({extended: false, limit:'50mb', parameterLimit: 3000000}));
app.get('/:index', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/index.html'));
})
app.use(express.static(staticPath));
const createHierarchy = obj => {
  let rootNodes = [];
  let unfixed = [];
  for (let prop in obj) {
    if (prop.endsWith('Par')) {
      let name = prop.slice(0, -3);
      //name of current elem
      let parent = obj[name+'Par'];
      if (obj[parent+'Par'] !== undefined) {
        unfixed.push(new tree.Tree({name: name, pos: obj[name+'Pos'], rot: obj[name+'Rot']}));
      } else {
        rootNodes.push(new tree.Tree({name: name, pos: obj[name+'Pos'], rot: obj[name+'Rot']}));
      }
    }
  }
  while(unfixed.length > 0) {
    unfixed = unfixed.filter(node => {
      let parent = rootNodes.map(rootNode => {
        return rootNode.find(n => {
          return n.name === obj[node.value.name+"Par"]
        });
      }).filter(e => e !== undefined)[0];
      if (parent) {
        parent.graft(node);
        return false;
      } else {
        return true;
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
  currentData = createHierarchy(fix(req.body));
  res.status(200).end();
  io.sockets.emit('current', exJSON.stringify({current: currentData}));
});

let server = app.listen(port, () => {
  console.log('App is listening on port', port);
});

io = require('socket.io')(server);
io.on('connection', (socket) => {
  socket.emit('current', exJSON.stringify({current: currentData}));
  socket.on('save', (data, cb) => {
    cb(dataDelegate.addData(data));
  });
  socket.on('retrieve', (savedLocation,cb) => {
    cb(dataDelegate.getData(savedLocation));
  }); 
});


