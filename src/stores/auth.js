import Rx from 'rx/dist/rx.all.min'

import Utils from '../utils'

let _currentUser;
let _auth;


export default (function() {

    let gapiLoadSubject = new Rx.Subject();
    let signInSubject = new Rx.Subject();
    let admin = true;

    let onSuccessAnimeAuthorized = _ => {
	console.log("authorized to add post to anime page");
    };
    let onErrorAnimeAuthorized = _ => {
	console.log("not authorized to add post to anime page");
    };

    
    let _authSignin = myAuth => {
	let isSigningIn = Rx.Observable.fromEventPattern(h => myAuth.isSignedIn.listen(h));
	isSigningIn.subscribe(signInStatus => console.log("is signing in? %s", signInStatus));
//	let currentUserSignIn = Rx.Observable.fromEventPattern(h => myAuth.currentUser.listen(h));
	let currentUserSignIn = Rx.Observable.merge(Rx.Observable.fromEventPattern(h => myAuth.currentUser.listen(h)), Rx.Observable.just(myAuth.currentUser.get()));
	currentUserSignIn.subscribe(signInSubject);
	currentUserSignIn.subscribe(user => {
	    console.log("current user %s", user);
	    _currentUser = user;
	    window.sessionStorage.setItem("jwt", user.getAuthResponse().id_token);
	    Rx.Observable.fromPromise($.ajax(Utils.get("/anime/authorized"))).subscribe(onSuccessAnimeAuthorized, onErrorAnimeAuthorized);
	    
	});


    };

    Rx.Observable.fromEvent(window, 'gapiLoaded')
	.do(evt => {
	    console.log("event gapi: %s", evt);
	})
	.selectMany(evt => Rx.Observable.just(evt.detail))
	.subscribe(gapiLoadSubject);
    //let signinSubject = new Rx.Subject();

    //let gapiLoad = Rx.Observable.fromCallback(gapi.load);
    //let load = gapiLoad('auth2').selectMany( _ => {
//	gapi.auth2.init({ client_id: "281796100165-8fjodck6rd1rp95c28ms79jq2ka2i6jg.apps.googleusercontent.com",
//			  cookiepolicy: 'single_host_origin' });
//	return Rx.Observable.just(gapi.auth2.getAuthInstance());
	
  //  });
    //load.subscribe(signinSubject);

   
    
    /*
    window.onSignIn = (user) => {
	if(!user) {
	    console.log("user undefined on login");
	    return;
	}
	console.log("signing in");
	_auth = gapi.auth2.getAuthInstance();
	_authSignin(_auth);
    };
    */
    
    return {
	init() {
	},
	currentUser() {
	    return _currentUser;
	},
	auth() {
	    return _auth;
	},
	registerGapiLoad(listener) {
	    return gapiLoadSubject.subscribe(listener);
	},
	authorized() {
	    return admin;
	},
	authSignin(auth) {
	    _authSignin(auth)
	},
	registerSignInCallback(callback) {
	   return signInSubject.subscribe(callback);
	}
    }
})()
