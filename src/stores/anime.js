import Utils from '../utils'
import Dispatcher from '../util/dispatcher'

export default (function() {
    let _view;
    let _posts;
    
    let viewChange = Rx.Observable.fromEventPattern( h => Dispatcher.register(h) )
	.filter(payload => { return payload.actionType === 'animeEdit' })
	.do(({view, id, rev}) => _view = {view,id,rev});

    let animeSubscription = Rx.Observable.timer(500, 30000)
	.flatMap(_ => $.ajax(Utils.get("/anime"))).retry().do(data => _posts = data);

    let changes = Rx.Observable.merge(animeSubscription, viewChange).publish();

    changes.connect();
    
    let store = {
	updatePost(id, rev, entry) {
	    console.log("updating posts " + id)
	    Rx.Observable.fromPromise($.ajax(Utils.post("/anime/" + id, {entry:entry, _rev: rev})));
	},
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
