import React from 'react'
import {THREE} from 'three'

export default React.createClass({
    getInitialState() {
	return {};
    },
    onFileChange(evt) {
	evt.preventDefault();
    },
    onDrop(evt) {
	//console.log("drop detected with files %s", evt.dataTransfer.files);
	if(evt.dataTransfer.files) {
	    Rx.Observable.from(evt.dataTransfer.files).subscribe(d => {
		console.log('uploading %s', d)
	    });
	}
	evt.preventDefault();
    },
    onDragOver(evt) {
	evt.preventDefault();
    },
    renderWebGL() {
	
	requestAnimationFrame( this.renderWebGL );
	if(this.state.renderer && this.state.scene && this.state.camera) {
	    this.state.renderer.render( this.state.scene, this.state.camera );
	}
    },
    
    componentDidMount() {
	let geometry = new THREE.BoxGeometry( 1, 1, 1 );
	let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	let cube = new THREE.Mesh( geometry, material );
	
	let renderer = new THREE.WebGLRenderer();
	renderer.domElement.style.width = "100%";
	let scene = new THREE.Scene();
	
	scene.add(cube);
	let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 5;
	this.setState({ renderer, scene, camera });
	this.renderWebGL();
	
    },
    render() {
	return (<div id='samples' className="section container">
		<h3>File Related Samples</h3>
		<div className="row">
		<div className="col s12" style={{height: '100px', backgroundColor: 'aqua'}} onDrop={this.onDrop} onDragOver={this.onDragOver}>
		
		</div>
		</div>
		
		<div className="row">
		<div className="col s12" style={{backgroundColor: 'tomato'}}>
		<form>
		<input type="file" onChange={this.onFileChange}></input>
		</form>
		</div>
		</div>
		<h3>WebGL Samples via Three JS</h3>
		<div className="row">
		<div className="col s12">
		<div id="threejs-content">
		{( _ => {
		    if(this.state.renderer) {
			$('#threejs-content')[0].appendChild(this.state.renderer.domElement);
		    }
		})()
		}
		</div>
		
		</div>
		</div>
		
		</div>
	       );
    }
});
