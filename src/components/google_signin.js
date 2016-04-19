import React from 'react/dist/react'
import Auth from '../stores/auth'

export default React.createClass({
    componentDidMount() {
//	window.onSignIn = (googleUser)=>{
	    //	    console.log("Signin via google with token " + googleUser.getAuthResponse().id_token);
//	    console.log("expires in " + googleUser.getAuthResponse().expires_in);
//	    window.sessionStorage.setItem("jwt", googleUser.getAuthResponse().id_token);
	    /*
	    let sigin = Rx.Observable.fromPromise($.ajax({ url: "http://localhost:3000/authorize",
							   method: "POST",
							   beforeSend: xhr => {
							       xhr.setRequestHeader("Authorization", "GoogleSignIn " + googleUser.getAuthResponse().id_token);
							   } }));
	    sigin.subscribe(data => {
		window.sessionStorage.setItem("jwt", data.token);
	    });
	    */
	//	}
	

	let signin = user => {
	    Auth.authSignin(gapi.auth2.getAuthInstance());
	};
	let failure = error => {
	    console.log("error on signin: %s", err.error);
	};
	Auth.registerGapiLoad(gapi => {
	    gapi.signin2.render('signin', { onSuccess: signin, onFailure: failure });
	});
//	Auth.registerSigninCallback(auth  => {
//	    gapi.signin2.render('signin', { onSuccess: signin , onFailure: failure });
//	    console.log("rendering signin");
//	    auth.attachClickHandler(document.querySelector('#signin'), {}, signin, err => {
		// occurs if element is immediately removed from pages, for example, if navigated to somewhere else
//		
//		auth.signIn();
//	    });
//	});

    },
    componentDidUpdate(nextprops,nextstate) {
    },
    googleButton() {
	return {
	    display: "inline-block",
	    background: "white",
	    color: "#444",
	    width: "190px",
	    borderRadius: "5px",
	    border: "thin solid #888",
	    boxShadow: "1px 1px 1px grey",
	    whiteSpace: "nowrap"
	    
	}
    },
    googleIcon() {
	return {
	    background: "url('/identity/sign-in/g-normal.png') transparent 5px 50% no-repeat",
	    display: "inline-block",
	    verticalAalign: "middle",
	    width: "42px",
	    height: "42px" }
    },
    googleText() {
	return {
	    display: "inline-block",
	    verticalAlign: "middle",
	    paddingLeft: "42px",
	    paddingRight: "42px",
	    fontSize: "14px",
	    fontWeight: "bold",
	    /* Use the Roboto font that is loaded in the <head> */
	    fontFamily: "'Roboto', sans-serif"
	}
    },
    customButton() {
	return (<div id="signin" style={this.googleButton()}>
		<span style={this.googleIcon()}></span>
		<span style={this.googleText()} >Google</span>
		</div>);

    },
    standardButton() {
	return (<div id="signin"></div>);
    },
    render() {
	return this.standardButton();
	//return (<div className="row center">
	//	<div className="col s1 offset-s5">
	//	{this.standardButton()}
	//	</div>
	//	</div>
	  //     );
    }
});
