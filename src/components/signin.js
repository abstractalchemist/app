import React from 'react/dist/react'

export default React.createClass({
    signinClicked(evt) {
	window.location = "http://localhost:3000/signin/oauth2?redirect=http://localhost:8000";
	evt.preventDefault()
    },
    render() {
	return (<div className="row">
		<button onClick={this.signinClicked} className="waves-effect btn">Sign In</button>
		</div>
	       );
	
    }
});
