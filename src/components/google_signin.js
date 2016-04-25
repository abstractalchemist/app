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

	});

    },
    standardButton() {
	return (<div id="signin">
		{( _ => {
		    if(this.state.gapi) {
			try {
			    this.state.gapi.signin2.render('signin', { onSuccess: this.signin, onFailure: this.failure });
			}
			catch(err) {
			}
		    }
		    return (<div></div>)
		})()
		}
		</div>);
    },
    render() {
	return this.standardButton();
    }
});
