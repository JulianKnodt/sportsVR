import React from 'react';
import { Entity } from 'aframe-react';
const Ball = props => {
  return (<Entity 
  geometry={{primitive: 'sphere', radius: 3, position:`${props.x} ${props.y} ${props.z}`}}
  material={{shader: 'flat', src: '/resources/field.jpeg'}}/>);
};
export default Ball;