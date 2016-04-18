import Utils from '../utils'
import Dispatcher from '../util/dispatcher'

export default (function() {
    let _posts;
   

    let animeSubscription = Rx.Observable.timer(500, 30000)
	.flatMap(_ => $.ajax(Utils.get("/anime"))).retry().do(data => _posts = data);

    let changes = animeSubscription.publish();
    let dispatcherEvents = Rx.Observable.fromEventPattern(h => Dispatcher.register(h)).repeat();
    
    let animeNewPost = dispatcherEvents
	.filter(payload => payload.actionType === 'newAnimePost')
	.selectMany(payload => $.ajax(Utils.put("/anime/", payload.data)))
	.selectMany(_ => $.ajax(Utils.get("/anime")))
	.subscribe(data => _posts = data,
		   _ => console.log("Error on new post"));

    let animeUpdatePost = dispatcherEvents
	.filter(payload => payload.actionType === 'updateAnimePost')
	.selectMany(payload => $.ajax(Utils.post("/anime/" + payload.data.id, payload.data)))
	.selectMany(_ => $.ajax(Utils.get("/anime")))
	.subscribe(data => _posts = data,
		   _ => console.log("Error on update new post"));

    let _schedule = Rx.Observable.fromPromise($.ajax(Utils.get("/anime/schedule")));
	    

    changes.connect();
    
    let store = {
	post(id) {
	    return Rx.Observable.fromPromise($.ajax(Utils.get("/anime/" + id)));
	},
	posts() {
	    return _posts;
	},
	view() {
	    return _view;
	},
	registerCallback(listener) {
	    return changes.subscribe(listener);
	},
	unregisterCallback(token) {
	    token.dispose();
	},
	schedule() {
	    return _schedule;
	},
	getArticle(id) {
	    return Rx.Observable.fromPromise($.ajax(Utils.get("/anime/" + id)));
	}
    };

    return store;
    
})()
