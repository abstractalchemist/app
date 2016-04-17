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
	    return Config.dataUrl() + "/anime/images/" + id
	}
    }
})()
