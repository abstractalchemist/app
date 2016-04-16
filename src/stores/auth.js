import Rx from 'rx/dist/rx.all.min'

let _currentUser;
let _auth;


export default (function() {

    let signInSubject = new Rx.Subject();
    let admin = true;
    window.onSignIn = function(user) {
	_auth = gapi.auth2.getAuthInstance();
	let isSigningIn = Rx.Observable.fromEventPattern(h => _auth.isSignedIn.listen(h));
	isSigningIn.subscribe(signInStatus => console.log("is signing in? %s", signInStatus));
//	_auth.isSignedIn.listen( isSigningIn => {
//	    console.log("is signing in? %s", isSigningIn);
		       //	});
	let currentUserSignIn = Rx.Observable.fromEventPattern(h => _auth.currentUser.listen(h));
	currentUserSignIn.subscribe(signInSubject);
	currentUserSignIn.subscribe(user => {
	    console.log("current user %s", user);
	    _currentUser = user;
	    window.sessionStorage.setItem("jwt", user.getAuthResponse().id_token);
//	    Rx.Observable.just(user).subscribe(signInSubject);
	    Rx.Observable.fromPromise($.ajax({ method: "GET", url: "/anime/authorized" })).subscribe(_ => {
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
