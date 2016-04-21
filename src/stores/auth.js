import Rx from 'rx/dist/rx.all.min'

import Utils from '../utils'

let _currentUser;
let _auth;


export default (function() {

    let gapiLoadSubject = new Rx.Subject();
    let signInSubject = new Rx.Subject();
    let admin = true;

    let animeAuthorizedSubject = new Rx.Subject(),
	imagesAccessSubject = new Rx.Subject(),
	frcAccessSubject = new Rx.Subject();
    
    let onSuccessAnimeAuthorized = _ => {
	console.log("authorized to add post to anime page");
    };
    let onErrorAuthorized = _ => {
	console.log("");
    };

    let onSuccessImagesAuthorized = _ => {
	console.log("authorized to acess image gallery");
    };

    let onSuccessFrcAuthorized = _ => {
	console.log("authorized to access frc page");
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
	    let animeAccessObs = Rx.Observable.fromPromise($.ajax(Utils.get("/anime/authorized")));
	    animeAccessObs.subscribe(onSuccessAnimeAuthorized, onErrorAuthorized);
	    animeAccessObs.subscribe(animeAuthorizedSubject);
	    
	    let imagesAccessObs = Rx.Observable.fromPromise($.ajax(Utils.get("/anime/images/authorized")));
	    imagesAccessObs.subscribe(onSuccessImagesAuthorized, onErrorAuthorized);
	    imagesAccessObs.subscribe(imagesAccessSubject);
	    
	    let frcAccessObs = Rx.Observable.fromPromise($.ajax(Utils.get("/frc/authorized")));
	    frcAccessObs.subscribe(onSuccessFrcAuthorized, onErrorAuthorized);
	    frcAccessObs.subscribe(frcAccessSubject);
	    
	});


    };

    Rx.Observable.fromEvent(window, 'gapiLoaded')
	.do(evt => {
	    console.log("event gapi: %s", evt);
	})
	.selectMany(evt => Rx.Observable.just(evt.detail))
	.subscribe(gapiLoadSubject);
    
    return {
	init() {
	},
	token() {
	    return window.sessionStorage.getItem('jwt');
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
	checkAnimePostAccess(callback) {
	    return animeAuthorizedSubject.subscribe(callback);
	},
	checkImagesAccess(callback) {
	    return imagesAccessSubject.subscribe(callback);
	},
	checkFrcAccess(callback) {
	    return frcAccessSubject.subscribe(callback);
	},
	checkAllAccess(callback) {
	    let mapAnimeAccess = d => {
		return { postAnime : d }
	    };
	    let mapImageAccess = d => {
		return { accessImages : d }
	    };
	    let mapFrcAccess = d => {
		return { accessFrc : d }
	    };
	
	    let accessCheck = Rx.Observable.merge( animeAuthorizedSubject.map(_ => true).catch(Rx.Observable.just(false)).map(mapAnimeAccess),
						    imagesAccessSubject.map(_ => true).catch(Rx.Observable.just(false)).map(mapImageAccess),
						    frcAccessSubject.map(_ => true).catch(Rx.Observable.just(false)).map(mapFrcAccess) )
		.toArray();
	    if(callback)
		accessCheck.subscribe(callback, _ => {});
	    else
		return accessCheck;
				  
	},
	authSignin(auth) {
	    _authSignin(auth)
	},
	registerSignInCallback(callback) {
	   return signInSubject.subscribe(callback);
	}
    }
})()
