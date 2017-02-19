import React from 'react';

class OpeningScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      opacity: 1
    }
    this.props = props;
  }
  transitionOpacity () {
    let interval = setInterval(function(){
      this.setState({opacity: this.state.opacity-.2});
      if (this.state.opacity < .2) {
        this.props.start();
        clearInterval(interval);
      }
    }.bind(this), 100);
  }
  render() {
    return (
      <div style={{width: '100vw', height: '100vh', 
      backgroundColor: 'black', position:'fixed', 
      opacity: this.state.opacity, margin:'0', padding:'0',
      top:'0', left:'0', display:'flex', justifyContent:'center',
      alignItems: 'center', flexDirection:'column',
      fontFamily: 'Orbitron', sansSerif: true}}>
        <h1 style={{top:'20vh', color:'white'}}>Punt, Pass & Kick</h1>
        <h4 style={{top:'20vh', color:'white'}}>Like no other through VR analysis</h4>
        <button onClick={() => {this.transitionOpacity()}}>Start</button>
      </div>
    );
  }
}


export default OpeningScreen;