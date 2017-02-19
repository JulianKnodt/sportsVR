import { Entity, Scene } from 'aframe-react';
import React from 'react';
import Camera from './view.jsx';
import Sky from './sky.jsx';
import Floor from './floor.jsx';
import Ball from './ball.jsx';

const toRawArray = obj => {
  let result = [];
  if (obj === null || obj === undefined) {
    return result;
  }
  for (let prop in obj) {
    if (prop.endsWith('Pos')) {
      result.push(obj[prop]);
    }
  }
  return result;
}

export default class RootScene extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      currentData: toRawArray(props.data)
    };
  }
  componentWillReceiveProps(newProps) {
    this.setState({currentData: toRawArray(newProps.data)});
  }
  render () {
    return (
    <Scene fog="">
      <a-assets></a-assets>
      {
        this.state.currentData
        .map((pos, i) => <Ball key={i} x={pos[0]} y={pos[1]} z={pos[2]}/>)
      }
      <Ball x="10" y="3" z="0"/>
      <Entity light={{type: 'ambient', color: '#888'}}/>
      <Entity light={{type: 'directional', intensity: 0.5}} position='-1 1 0'/>
      <Entity light={{type: 'directional', intensity: 1}} position='1 1 0'/>
      <Floor src="/resources/field.png"/>
      <Sky src="/resources/sky.jpeg"/>
      <Camera/>
    </Scene>);
  }
}