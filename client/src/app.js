import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import RootScene from './components/rootScene.jsx';

const App = () => (
  <div>
    <RootScene />
  </div>
);

ReactDOM.render(<App/>, document.getElementById('root'));