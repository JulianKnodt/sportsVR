import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import RootScene from './components/rootScene.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentData: undefined
    }
    this.socket = io.connect(window.location.origin);
    this.socket.on('current', function(data) {
      this.setState({currentData: data.current});
    }.bind(this));
  }
  render() {
    return (
      <div>
        <RootScene data={this.state.currentData}/>
      </div>
    );
  }
};


ReactDOM.render(<App />, document.getElementById('root'));