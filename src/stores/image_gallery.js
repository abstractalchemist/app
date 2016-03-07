import Utils from "../utils"


export default (function() {

    let _images = {};
    let connect = Rx.Observable
	.timer(500,30000)
	.flatMap(_ => $.ajax(Utils.get("/anime/images")) )
	.do(data =>  _images = data).publish();
    
    connect.connect();

    let store = {
	images() {
	    return _images;
	},
	registerCallback(listener) {
	    return changes.subscribe(listener);
	},
	unregisterCallback(token) {
	    token. dispose();
	}
    };
    
    return store;
    
})()
