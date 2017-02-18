import { Entity, Scene } from 'aframe-react';
import React from 'react';
import Camera from './view.jsx';
import Sky from './sky.jsx';
import Floor from './floor.jsx';

export default class RootScene extends React.Component {
  constructor (props) {
    super(props);
    this.props = props;
  }
  render () {
    return (
    <Scene fog="">
      <a-assets></a-assets>
      <Entity light={{type: 'ambient', color: '#888'}}/>
      <Entity light={{type: 'directional', intensity: 0.5}} position='-1 1 0'/>
      <Entity light={{type: 'directional', intensity: 1}} position='1 1 0'/>
      <Floor src="/resources/field.png"/>
      <Sky src="/resources/sky.jpeg"/>
      <Camera/>
    </Scene>);
  }
}