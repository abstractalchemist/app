import React from 'react/dist/react'
import Auth from '../stores/auth'
import Device from '../stores/device'

export default React.createClass({
    getInitialState() {
	return {};
    },

    signin() {
	Auth.authSignin(gapi.auth2.getAuthInstance());
    },
    failure() {
	console.log("error on signin: %s", err.error);
    },
    componentDidMount() {

	let signin = user => {
	    Auth.authSignin(gapi.auth2.getAuthInstance());
	};
	let failure = error => {
	    console.log("error on signin: %s", err.error);
	};
	Auth.registerGapiLoad(gapi => {
	    this.setState({ gapi: gapi });
	    try {
		gapi.auth2.getAuthInstance().signIn();
		this.signin();
	    }
	    catch(error) {
		console.log("Error on auto signin: %s", error);
	    }
	    gapi.auth2.getAuthInstance().attachClickHandler(document.querySelector("#customBtn"), {}, this.signin, this.failure);
	});

    },
    style() {
	if(Device.mobile()) {
	    return { paddingBottom: "10px" }
	}
	return { height: "100%", paddingRight: "10px" };
	
    },
    standardButton() {
	return (<div>
		{ ( _ => {
		    if(Device.mobile()) {
			return ( <span style={{color:"black"}}>Sign In With:</span> );
		    }
		})()
		}
		<div id="signin" className="valign-wrapper" style={this.style()}>
		<div id="customBtn" className="valign btn">
		<span className="icon"></span>
		<span className="buttonText">{( _ => {
		    if(Device.mobile())
			return "Google"
		    return "Sign In With Google"
		})()
					     }</span>
		</div>
		</div>
		</div>);
    },
    render() {
	return this.standardButton();
    }
});
