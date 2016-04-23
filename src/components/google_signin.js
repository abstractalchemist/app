import React from 'react/dist/react'
import Auth from '../stores/auth'

export default React.createClass({
    componentDidMount() {
	

	let signin = user => {
	    Auth.authSignin(gapi.auth2.getAuthInstance());
	};
	let failure = error => {
	    console.log("error on signin: %s", err.error);
	};
	Auth.registerGapiLoad(gapi => {
	    gapi.signin2.render('signin', { onSuccess: signin, onFailure: failure });
	});

    },
    standardButton() {
	return (<div id="signin"></div>);
    },
    render() {
	return this.standardButton();
    }
});
