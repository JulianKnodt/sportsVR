import React from 'react';
import { Entity } from 'aframe-react';
const Ball = props => {
  let color = 'color: red';
  const extraProps = AFRAME.utils.extend({}, props);
  delete extraProps.color;
  delete extraProps.position;
  return (<Entity 
  geometry={{primitive: 'sphere', radius: .1}}
  material={color}
  position={`${props.x*2} ${props.y*2} ${props.z*2}`}
  {...extraProps}/>);
};
export default Ball;