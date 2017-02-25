import React from 'react';
import { Entity } from 'aframe-react';
const Ball = props => {
  let object = props.root;
  let pos = object.value.pos;
  let color = 'color: red';
  const extraProps = AFRAME.utils.extend({}, props);
  delete extraProps.color;
  delete extraProps.position;
  return (<Entity 
  geometry={{primitive: 'sphere', radius: .1}}
  material={color}
  position={`${pos[0]} ${pos[1]} ${pos[2]}`}
  {...extraProps}/>);
};
export default Ball;