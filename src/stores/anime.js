import Utils from '../utils'
import Dispatcher from '../util/dispatcher'

export default (function() {
    let _posts;

    let animeSubscription = Rx.Observable.timer(500, 30000)
	.flatMap(_ => $.ajax(Utils.get("/anime"))).retry().do(data => _posts = data);

    let changes = animeSubscription.publish();
    let dispatcherEvents = Rx.Observable.fromEventPattern(h => Dispatcher.register(h));
    let animeNewPost = dispatcherEvents
	.filter(payload => payload.actionType === 'newAnimePost')
	.selectMany(payload => $.ajax(Utils.post("/anime/" + payload.data.id, payload.data)))
	.selectMany(_ => $.ajax(Utils.get("/anime")))
	.do(data => _posts = data);

    let animeUpdatePost = dispatcherEvents
	.filter(payload => payload.actionType === 'updateAnimePost')
	.selectMany(payload => $.ajax(Utils.put("/anime/", payload.data)))
	.selectMany(_ => $.ajax(Utils.get("/anime")))
	.do(data => _posts = data);
	    

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
	}
    };

    return store;
    
})()
