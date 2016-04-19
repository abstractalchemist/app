import Rx from 'rx/dist/rx.all.min'

import Utils from '../utils'

let _currentUser;
let _auth;


export default (function() {

    let signInSubject = new Rx.Subject();
    let admin = true;
    window.onSignIn = function(user) {
	if(!user) {
	    console.log("user undefined on login");
	    return;
	}
	_auth = gapi.auth2.getAuthInstance();
	let isSigningIn = Rx.Observable.fromEventPattern(h => _auth.isSignedIn.listen(h));
	isSigningIn.subscribe(signInStatus => console.log("is signing in? %s", signInStatus));
	let currentUserSignIn = Rx.Observable.fromEventPattern(h => _auth.currentUser.listen(h));
	currentUserSignIn.subscribe(signInSubject);
	currentUserSignIn.subscribe(user => {
	    console.log("current user %s", user);
	    _currentUser = user;
	    window.sessionStorage.setItem("jwt", user.getAuthResponse().id_token);
	    Rx.Observable.fromPromise($.ajax(Utils.get("/anime/authorized"))).subscribe(_ => {
		console.log("authorized to add post to anime page");
	},
												     _ => {
													 console.log("not authorized to add post to anime page");
												     });
	    
	});

    };
    
    
    return {
	init() {
	},
	currentUser() {
	    return _currentUser;
	},
	auth() {
	    return _auth;
	},
	register(listener) {
	    return signInSubject.subscribe(listener);
	},
	authorized() {
	    return admin;
	}
    }
})()
