import Utils from '../utils'
import Config from '../config'

export default (function() {
    let images = Rx.Observable.fromPromise($.ajax(Utils.get("/anime/images")));
    return {
	
	authorized() {
	    return true;
	},
	images() {
	    return images;
	},
	imageUrl(id) {
	    if(id == undefined) {
		console.log("Error cannot get id of undefined");
		return "";
	    }
	    if(id.startsWith('http://'))
		return id;
	    return Config.dataUrl() + "/anime/images/" + id
	}
    }
})()
