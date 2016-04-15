import React from 'react/dist/react.min'

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
    render() {
	return (<div id='samples' className="section container">
		<h3>File Related Samples</h3>
		<div className="row">
		<div className="col s12" style={{height: '100px', backgroundColor: 'aqua'}} onDrop={this.onDrop} onDragOver={this.onDragOver}>
		
		</div>
		</div>
		
		<div className="row">
		<div classname="col s12" style={{backgroundColor: 'tomato'}}>
		<form>
		<input type="file" onChange={this.onFileChange}></input>
		</form>
		</div>

		</div>
		</div>
	       );
    }
});
