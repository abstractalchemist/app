import React from 'react/dist/react'
import Auth from '../stores/auth'
import Device from '../stores/device'

export default React.createClass({
    getInitialState() {
	return {};
    },

    signin() {
	if(this.isMounted)
	    Auth.authSignin(gapi.auth2.getAuthInstance());
    },
    failure() {
	console.log("error on signin: %s", err.error);
    },
    componentDidMount() {
	this.authDispose = Auth.registerGapiLoad(gapi => {
	    this.setState({ gapi: gapi });
	    let authSignIn = data => {
		this.signin();
	    };
	    let authError = error => {
	    };
	    
	    
	    try {
		// if there is a user;
		// if not signed in
		if(gapi.auth2.getAuthInstance().isSignedIn.get()) {
		    
		    console.log("is signed in; signing in");
		    Rx.Observable.fromPromise(gapi.auth2.getAuthInstance().signIn()).subscribe(authSignIn, authError);
		}
		else {
		    console.log("not signedIn");
		}

	    }
	    catch(error) {
		console.log("Error on auto signin: %s", error);
	    }
	    gapi.auth2.getAuthInstance().attachClickHandler(document.querySelector("#customBtn"), {}, this.signin, this.failure);
	    this.isMounted = true;
	});

    },
    componentWillUnmount() {
	if(this.authDispose) {
	    this.authDispose.dispose();
	}
	this.isMounted = false;
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
