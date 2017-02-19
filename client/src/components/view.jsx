import React from 'react';
import { Entity } from 'aframe-react';
const Camera = props => (
  <Entity>
     <Entity 
    camera={{userHeight: .5}}
    look-controls=""
    wasd-controls={{acceleration: 360}}
    position="0 3 0"
    {...props}/>
  </Entity>
)

export default Camera;