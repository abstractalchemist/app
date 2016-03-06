import React from 'react/dist/react'

export default React.createClass({
    componentDidMount() {
	window.onSignIn = (googleUser)=>{
//	    console.log("Signin via google with token " + googleUser.getAuthResponse().id_token);
	    window.sessionStorage.setItem("jwt", googleUser.getAuthResponse().id_token);
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
