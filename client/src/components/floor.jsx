import React from 'react';
import { Entity, Scene } from 'aframe-react';

const Floor = props => (
  <Entity
    geometry={{primitive: 'plane'}}
    material={{shader: 'flat', src: props.src, side: 'double'}}
    scale="360 140 1"
    position="0 -5 0"
    rotation="-90 0 0"/>
);
export default Floor;