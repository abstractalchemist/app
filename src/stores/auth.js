export default (function() {
    
    let _currentUser;
    let _auth;
    window.gapi.load('auth2', _ => {
	_auth = window.gapi.auth2.init({
	    client_id: $('meta[name=google-signin-client_id]').attr('content'),
	    scope: 'openid'
	});
	_auth.isSignedIn.listen(val => {
	    console.log("sigin event received %s", val);
	    $('signed-in-cell').text(val);
	    
	});
	_auth.currentUser.listen(user => {
	    console.log("current user %s", user);
	    _currentUser = user;
	    window.sessionStorage.setItem("jwt", user.getAuthResponse().id_token);
	});
    });
    
    return {
	init() {
	},
	currentUser() {
	    return _currentUser;
	},
	auth() {
	    return _auth;
	}
    }
})()
