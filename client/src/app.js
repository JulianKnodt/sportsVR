import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import RootScene from './components/rootScene.jsx';
import Structures from '../../Structures.js';

const findAngle = (A,B,C) => {
    var AB = Math.sqrt(Math.pow(B.x-A.x,2) + Math.pow(B.y-A.y,2) + Math.pow(B.z-A.z,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2) + Math.pow(B.y-C.y,2) + Math.pow(B.z-C.z,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2) + Math.pow(C.y-A.y,2) + Math.pow(C.z-A.z,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.back = new Structures.Stack();
    this.backFill = new Structures.Stack();
    this.forward = new Structures.Queue();
    this.state = {
      paused: false,
      currentData: undefined,
      selectedPoints: []
    }
    this.socket = io.connect(window.location.origin);
    this.socket.on('current', function(data) {
      if (!this.state.currentData) {
        this.setState({currentData: data.current});
      } else {
        this.forward.enqueue(data.current);
        if (!this.state.paused) {
          this.go();
        }
      }
    }.bind(this));
  }
  componentDidMount () {
    window.onkeydown =function(e) {
      let key = e.which;
      if (key === 81 && this.state.paused) {
        //left q-key
        console.log('back')
        this.prev();
        e.preventDefault();
      } else if (key === 69) {
        //right e-key
        console.log('proceed to next');
        this.go();
      } else if (key === 32) {
        //pause
        this.setPause(!this.state.paused);
        console.log(this.state.paused ? 'paused' : 'unpaused');
      }
    }.bind(this);
  }
  go (steps=1) {
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
    if (this.back.length > 500) {
      this.back = this.back.pull(400);
    }
    this.setState({currentData: next});
    return next;
  }
  prev(steps=1) {
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
  setPause (bool) {
    this.setState({paused: bool});
  }
  updateSelectedPoints(cb) {
    this.setState({selectedPoints: cb(this.state.selectedPoints)});
    console.log(this.state.selectedPoints)
  }
  render() {
    return (
      <div>
        <RootScene
        data={this.state.currentData}
        setPause={this.setPause.bind(this)}
        isPaused={this.state.isPaused}
        selectedPoints={this.state.selectedPoints}
        setSelectedPoints={this.updateSelectedPoints.bind(this)}/>
      </div>
    );
  }
};


ReactDOM.render(<App />, document.getElementById('root'));