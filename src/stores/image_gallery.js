import Utils from "../utils"

export default (function() {

    return {
	images() {
	    return Rx.Observable.fromPromise($.ajax(Utils.get("/anime/images")));
	}
    }
    
})()
