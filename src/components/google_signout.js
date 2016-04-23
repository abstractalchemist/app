import React from 'react'
import Rx from 'rx'
import Auth from '../stores/auth'

export default React.createClass({
    getInitialState() {
	return {}
    },
    componentDidMount() {
	
	Auth.registerGapiLoad(gapi => {
	    this.gapi = gapi;
	});
	Auth.registerSignInCallback(user => this.setState({ isSignedIn: user.isSignedIn() }));
    },
    onClick(evt) {
	try {
	    this.gapi.auth2.getAuthInstance().signOut();
	}
	catch(error) {
	    console.log(error);
	}
	evt.preventDefault();
    },
    style() {
	if(this.state.isSignedIn)
	    return { display: "block" };
	return { display: "none" };
    },
    render() {
	return ( <button style={this.style()} onClick={this.onClick} className="btn">Sign Out</button> );
    }
})
