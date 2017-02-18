import React from 'react';
import { Entity } from 'aframe-react';
const Sky = props => (
  <Entity
    geometry={{primitive: 'sphere', radius: 200}}
    material={{shader: 'flat', src: props.src}}
    scale="1 1 -1"/>
);

export default Sky;