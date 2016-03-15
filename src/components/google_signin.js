import React from 'react/dist/react'

export default React.createClass({
    componentDidMount() {
	window.onSignIn = (googleUser)=>{
	    //	    console.log("Signin via google with token " + googleUser.getAuthResponse().id_token);
	    console.log("expires in " + googleUser.getAuthResponse().expires_in);
	    //window.sessionStorage.setItem("jwt", googleUser.getAuthResponse().id_token);
	    let sigin = Rx.Observable.fromPromise($.ajax({ url: "http://localhost:3000/authorize",
							   method: "POST",
							   beforeSend: xhr => {
							       xhr.setRequestHeader("Authorization", "GoogleSignIn " + googleUser.getAuthResponse().id_token);
							   } }));
	    sigin.subscribe(data => {
		window.sessionStorage.setItem("jwt", data.token);
	    });
	}
    },
    render() {
	return (<div className="row center">
		<div className="col s1 offset-s5">
		<div className="g-signin2" data-onsuccess="onSignIn" data-theme="dark"></div>
		</div>
		</div>
	       );
    }
});
