import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import RootScene from './components/rootScene.jsx';
import OpeningScreen from './components/openingScreen.jsx';
import Structures from '../../Structures.js';
import aframeMeshlineComponent from 'aframe-meshline-component';
import Notifications, {notify} from 'react-notify-toast';
import exJSON from 'exjson';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.back = new Structures.Stack();
    this.backFill = new Structures.Stack();
    this.forward = new Structures.Queue();
    this.state = {
      paused: false,
      opened: false,
      currentData: undefined,
      selectedPoints: []
    }
    this.socket = io.connect(window.location.origin);
    let path = window.location.pathname.split('/').filter(x => x !== "");
    if (path.length > 0) {
      this.socket.on('connect', function() {
        this.socket.emit("retrieve", path[0], function(data) {
          if (data !== null) {
            this.forward = new Structures.Queue(...exJSON.parse(data));
            setInterval(function(){
              if(!this.state.paused) {
                this.go();
              }
            }.bind(this), 33.33);
          } else {
            window.location.replace(window.location.origin)
          }
        }.bind(this));
      }.bind(this));
    } else {
      this.socket.on('current', function(data) {
        data = exJSON.parse(data);
        if (!this.state.currentData) {
          this.setState({currentData: data.current || []});
        } else {
          this.forward.enqueue(data.current || []);
          if (!this.state.paused) {
            this.go();
          }
        }
      }.bind(this));
    }
  }
  componentDidMount () {
    let path = window.location.pathname.split('/').filter(x => x !== "");
    window.addEventListener('keydown', function(e) {
      let key = e.which;
      if (key === 81 && this.state.paused) {
        //left q-key
        console.log('back')
        this.prev();
        e.preventDefault();
      } else if (key === 69) {
        //right e-key
        console.log('proceed');
        this.go();
      } else if (key === 32) {
        //pause
        this.setPause(!this.state.paused);
        console.log(this.state.paused ? 'paused' : 'unpaused');
      } else if (key === 82 && path.length === 0) {
        let data = this.back.storage.concat(...this.backFill.storage).concat([this.state.currentData]);
        this.socket.emit("save", exJSON.stringify(data), index => {
          notify.show(`Your 3D self was saved at ${window.location.origin + '/' + index.url} for ${index.duration/60000} minutes!`, "success");
        });
      }
    }.bind(this));
  }
  go (steps=1) {
    if (this.forward.length > 0) {
      let next;
      let poss;
      steps--;
      if (this.state.currentData) {
        this.back.push(this.state.currentData);
      }
      while(steps --) {
        if (this.backFill.length) {
          poss = this.backFill.pop();
          next = poss || next;
          this.back.push(next);
        } else {
          poss = this.forward.dequeue();
          next = poss || next;
          if (next) {
            this.back.push(next);
          }
        }
      }
      poss = this.backFill.length ? this.backFill.pop() : this.forward.dequeue();
      next = next || poss;
      if (this.back.length > 3000) {
        this.back = this.back.pull(400);
      }
      this.setState({currentData: next});
      return next;
    }
  }
  prev(steps=1) {
    if (this.back.length > 0) {
      let prev;
      let poss;
      steps --;
      this.backFill.push(this.state.currentData);
      while (steps --) {
        poss = this.back.pop();
        prev = poss || prev;
        if(prev) {
          this.backFill.push(prev);
        }
      }
      poss = this.back.pop();
      prev = poss || prev;
      this.setState({currentData: prev});
      return prev;
    }
  }
  setPause (bool) {
    this.setState({paused: bool});
  }
  updateSelectedPoints(cb) {
    this.setState({selectedPoints: cb(this.state.selectedPoints)});
  }
  start () {
    this.setState({opened: true});
  }
  render() {
    if(this.state.opened) {
      return (<div><Notifications/><RootScene
      data={this.state.currentData}
      setPause={this.setPause.bind(this)}
      isPaused={this.state.isPaused}
      selectedPoints={this.state.selectedPoints}
      setSelectedPoints={this.updateSelectedPoints.bind(this)}/></div>)
    } else {
      return (
        <div>
          <Notifications/>
          <OpeningScreen
          start={this.start.bind(this)}/>
        </div>);
    }
  }
};


ReactDOM.render(<App />, document.getElementById('root'));