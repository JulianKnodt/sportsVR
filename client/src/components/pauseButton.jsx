import react from 'react';
import { Entity } from 'aframe-react';

const PauseButton = props => (
  <Entity
    geometry={{primitive: 'box'}}
    material={{color: 'red'}}
    scale="4 5 4"
    position="0 -1 0"/>
);
export default PauseButton;