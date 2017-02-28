import React from 'react';
import {Entity} from 'aframe-react';

const x = arr => arr[0];
const y = arr => arr[1];
const z = arr => arr[2];
const findAngle = (A,B,C) => {
    var AB = Math.sqrt(Math.pow(B.x-A.x,2) + Math.pow(B.y-A.y,2) + Math.pow(B.z-A.z,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2) + Math.pow(B.y-C.y,2) + Math.pow(B.z-C.z,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2) + Math.pow(C.y-A.y,2) + Math.pow(C.z-A.z,2));
    return Math.round(Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB))*180/Math.PI);
}

const avgCoordinates = (a,b,c) => {
  return {x:(a.x + b.x + c.x)/3, y:(a.y+b.y+c.y)/3, z:(a.z+b.z+c.z)/3}
}

const depthFirst = (top, cb) => {
  let current = top;
  current.children = current.children.filter(x => x !== undefined);
  cb(current.value);
  current.children.forEach(child => depthFirst(child, cb));
}

const GameObject = props => {
  //expecting prop root
  let pPos = props.parentPos;
  let depth = props.depth || 0;
  let value = props.root.value;
  let pos = value.pos;
  let children = props.root.children;
  let s = num => num * (props.scale || 2);
  // let path = "";
  // if (props.isRoot) {
  //   depthFirst(props.root, value => {
  //     path += s(x(value.pos)) + " " + s(y(value.pos)) + " " + s(z(value.pos)) + ",";
  //   });
  // }
  let cx = s(x(pos));
  let cy = s(y(pos));
  let cz = s(z(pos));
  let convertToObj = (p,s=s=>1) => {
   return {x:p[0], y:p[1], z:p[2]};
  }
  if (depth >= 10) {
    return null;
  } else {
    return (
      <Entity>
        {
         // props.isRoot ? 
         //  <Entity meshline={`lineWidth: 15; path: ${path}`}/>
         // : '' 
        }
        {
          children
          .filter(child => child !== undefined)
          .filter(child => !child.value.name.startsWith('Bone'))
          .map(child => child.value.pos)
          .map((p, i) => 
            <Entity key={i} meshline={`lineWidth: ${15-depth}; path: ${cx} ${cy} ${cz}, ${s(x(p))} ${s(y(p))} ${s(z(p))};`}/>
          )
        }
        {
          pPos ?
            children
            .filter(child => child !== undefined)
            .filter(child => !child.value.name.startsWith('Bone'))
            .map(child => child.value.pos)
            .map((p, i) => {
              let current = convertToObj([cx, cy, cz]);
              let child = convertToObj([x(p), y(p), z(p)], s);
              let parent = convertToObj([x(pPos), y(pPos), z(pPos)], s);
              let angle = findAngle(current, child, parent);
              let avg = avgCoordinates(current, child, parent);
              if (!Number.isNaN(angle)) {
                return (<Entity key={i}
                text={`value: ${angle + "°"}`}
                position={`${1.6* (avg.x)} ${1.6*(avg.y)} ${1.6*(avg.z)}`}
                look-controls=''
                visible={props.renderText}/>)
              } else {
                return '';
              }
            })
          : ''
        }
        {
          children
          .filter(child => child !== undefined)
          .filter(child => !child.value.name.startsWith('bone'))
          .map((child, i) => 
            <GameObject key={i} root={child} 
            depth={depth+1} scale={props.scale||2} 
            parentPos={pos} renderText={props.renderText}
            isRoot={false}/>
          )
        }
      </Entity>
    );
  }
}

export default GameObject;