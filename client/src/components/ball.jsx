import React from 'react';
import { Entity } from 'aframe-react';
const Ball = props => {
  return (<Entity 
  geometry={{primitive: 'sphere', radius: .1}}
  material={{shader: 'flat', src: '/resources/red.jpeg'}}
  position={`${props.x*2} ${props.y*2} ${props.z*2}`}/>);
};
export default Ball;