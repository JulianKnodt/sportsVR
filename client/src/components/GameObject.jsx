import React from 'react';
import {Entity} from 'aframe-react';

const x = arr => arr[0];
const y = arr => arr[1];
const z = arr => arr[2];
const GameObject = props => {
  //expecting prop root
  let depth = props.depth || 0;
  let value = props.root.value;
  let pos = value.pos;
  let children = props.root.children;
  let s = num => num * (props.scale || 2);
  return (
    <Entity>
      {
        children
        .filter(child => child !== undefined)
        .filter(child => !child.value.name.startsWith('Bone'))
        .map(child => child.value.pos)
        .map((p, i) => 
          <Entity key={i} meshline={`lineWidth: ${5}; path: ${s(x(pos))} ${s(y(pos))} ${s(z(pos))}, ${s(x(p))} ${s(y(p))} ${s(z(p))};`}/>
        )
      }
      {
        children
        .filter(child => child !== undefined)
        .filter(child => !child.value.name.startsWith('bone'))
        .map((child, i) => 
          <GameObject key={i} root={child} depth={depth+2}/>
        )
      }
    </Entity>
  );
}

export default GameObject;