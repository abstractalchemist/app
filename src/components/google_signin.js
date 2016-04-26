import React from 'react/dist/react'
import Auth from '../stores/auth'

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
    standardButton() {
	return (<div id="signin">
		<div id="customBtn" className="customGPlusSignIn" style={{height:"48px", width:"120px"}}>
		<span className="icon"></span>
		<span className="buttonText">Google</span>
		</div>
		</div>);
    },
    render() {
	return this.standardButton();
    }
});
