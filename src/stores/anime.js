import Utils from '../utils'

export default (function() {
    return {
	get() {
	    //return Rx.Observable.fromPromise($.ajax(Utils.get("/anime")));
	    return $.ajax(Utils.get("/anime"));
	}
    }
})()
