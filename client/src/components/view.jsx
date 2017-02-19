import React from 'react';
import { Entity } from 'aframe-react';
const Camera = props => (
  <Entity>
     <Entity 
    camera={{userHeight: .5}}
    look-controls=""
    wasd-controls={{acceleration: 360}}
    position="0 3 0"
    {...props}>
    <Entity cursor="fuse: true; fuseTimeout: 500"
      position="0 0 -1"
      geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.02"
      material="color: rgba(0,0,0,.5); shader: flat"/>
    </Entity>
  </Entity>
)

export default Camera;