import Utils from '../utils'
import Dispatcher from '../util/dispatcher'

export default (function() {
    let _view = {};
    let _posts = {}
    
    let viewChange = Rx.Observable.fromEventPattern( h => Dispatcher.register(h) )
	.filter(payload => { return payload.actionType === 'animeEdit' })
	.do(payload => view = payload.view);

    let animeSubscription = Rx.Observable.timer(500, 30000)
	.flatMap(_ => $.ajax(Utils.get("/anime"))).do(data => _posts = data);

    let changes = Rx.Observable.merge(animeSubscription, viewChange).publish();

    changes.connect();
    
    let store = {
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
