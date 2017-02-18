import React from 'react';
import { Entity } from 'aframe-react';
const Camera = props => (
  <Entity>
     <Entity camera="" look-controls="" wasd-controls={{acceleration: 360}} {...props}/>
  </Entity>
)

export default Camera;