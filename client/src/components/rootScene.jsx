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
      currentData: toRawArray(props.data),
      selected: []
    };
    this.props = props;
  }
  componentWillReceiveProps(newProps) {
    let raw = toRawArray(newProps.data);
    if (raw !== this.state.currentData) {
      this.setState({currentData: raw});
    } else if (newProps.selectedPoints !== this.state.selected) {
      this.setState({selected: newProps.selectedPoints});
    }
  }
  addSelected(newElem) {
    if (!(newElem in this.state.selected)) {
      this.setState({selected: this.state.selected.concat([newElem])});
    } else {
      this.setState({selected: this.state.selected.filter(e => e !== newElem)})
    }
  }
  removeSelected(newElem, index) {
    this.setState({selected: this.state.selected.filter((e, i) => i !== index)});
  }
  render () {
    return (
    <Scene fog="type: linear; color: #000;">
      <a-assets></a-assets>
      {
        this.state.currentData
        .map(function(pos, i) 
        {return <Ball key={i} x={pos[0]} y={pos[1]} z={pos[2]} onClick={() => this.addSelected(pos)}/>}.bind(this))
      }
      {
        this.state.selected
        .map((pos, i) => <Ball key={i} x={pos[0]} y={pos[1]} z={pos[2]}
          material='color: blue'
          geometry={{primitive: 'sphere', radius: .2}}
          onClick={() => this.removeSelected(pos, i)}/>)
      }
      <Ball x={3} y={3} z={3} onClick={() => this.addSelected([3, 3, 3])}/>
      <Entity light={{type: 'ambient', color: '#888'}}/>
      <Entity light={{type: 'directional', intensity: 0.5}} position='-1 1 0'/>
      <Entity light={{type: 'directional', intensity: 1}} position='1 1 0'/>
      <Floor src="/resources/field.png"/>
      <Sky src="/resources/sky.jpeg"/>
      <Camera/>
    </Scene>);
  }
}
      // <Ball x="10" y="3" z="0"/> //testball