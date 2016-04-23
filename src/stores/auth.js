import Rx from 'rx/dist/rx.all.min'

import Utils from '../utils'

let _currentUser;
let _auth;


export default (function() {

    let gapiLoadSubject = new Rx.Subject(1);

    // the subject which determinaes who is signed in
    let signInSubject = new Rx.Subject(1);

    let admin = true;

    
    let animeAccessObs = Rx.Observable.fromPromise($.ajax(Utils.get("/anime/authorized"))).map( _ =>  true).catch(Rx.Observable.just(false)).do(data => console.log("resolving anime access %s", data));
    
    let imagesAccessObs = Rx.Observable.fromPromise($.ajax(Utils.get("/anime/images/authorized"))).map( _ => true).catch(Rx.Observable.just(false)).do(data => console.log("resolving image access %s", data));
    
    let frcAccessObs = Rx.Observable.fromPromise($.ajax(Utils.get("/frc/authorized"))).map( _ => true).catch(Rx.Observable.just(false)).do(data => console.log("resolving frc access %s", data));

    let mapAnimeAccess = d => {
	console.log("Mapping access post %s", d);
	return { postAnime : d }
    };

    let mapImageAccess = d => {
	console.log("Mapping access image %s", d);
	return { accessImages : d }
    };

    let mapFrcAccess = d => {
	console.log("Mapping access frc %s", d);
	return { accessFrc : d }
    };

    let animeAuthorizedSubject = new Rx.BehaviorSubject(false),
	imagesAccessSubject = new Rx.BehaviorSubject(false),
	frcAccessSubject = new Rx.BehaviorSubject(false);

    
    let animeStatus = false, imageStatus = false, frcStatus = false;
    
    let forwardAnimeStatus = data => {
	animeAuthorizedSubject.onNext(data);
	animeStatus = data;
    };
    let forwardImageStatus = data => {
	imagesAccessSubject.onNext(data);
	imageStatus = data;
    };
    let forwardFrcStatus = data => {
	frcAccessSubject.onNext(data);
	frcStatus = data;
    };

    let forwardAllStatus = (a,b,c) => {
	
    };
        
    let revokeAccess = _ => {
	console.log("revoking access");
	forwardAnimeStatus(false);
	forwardImageStatus(false);
	forwardFrcStatus(false);
	
    };

    revokeAccess();
    
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
	
	// the current user
	let currentUserSignIn = Rx.Observable.merge(Rx.Observable.fromEventPattern(h => myAuth.currentUser.listen(h)), Rx.Observable.just(myAuth.currentUser.get()));
	currentUserSignIn.subscribe(signInSubject);
	currentUserSignIn.subscribe(user => {
	    console.log("user sign in? %s", user.isSignedIn());
	    if(user.isSignedIn()) {
		
		_currentUser = user;
		window.sessionStorage.setItem("jwt", user.getAuthResponse().id_token);
		animeAccessObs.subscribe(data => forwardAnimeStatus(data));
		imagesAccessObs.subscribe(data => forwardImageStatus(data));
		frcAccessObs.subscribe(data => forwardFrcStatus(data));
		
	    }
	    else {
		window.sessionStorage.setItem("jwt", "");
		revokeAccess();
	    }
	    
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
	    let access = animeAuthorizedSubject.map(mapAnimeAccess);
	    if(callback)
		return access.subscribe(callback);
	    return access;
	},
	checkImagesAccess(callback) {
	    let access = imagesAccessSubject.map(mapImageAccess);
	    if(callback)
		return access.subscribe(callback);
	    return access;
	},
	checkFrcAccess(callback) {
	    let access = frcAccessSubject.map(mapFrcAccess);
	    if(callback)
		return access.subscribe(callback);
	    return access;
	},
	authSignin(auth) {
	    _authSignin(auth)
	},
	registerSignInCallback(callback) {
	    
	    return signInSubject.subscribe(callback, error => console.log(error));
	}
    }
})()
