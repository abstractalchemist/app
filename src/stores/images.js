import Utils from '../utils'
import Config from '../config'
import Auth from './auth'

export default (function() {
    
    let images;
    try {
	images = Rx.Observable.fromPromise($.ajax(Utils.get("/anime/images"))).catch();
//	images.subscribe( evt => console.log("success"),
//			  error => console.log("images error %s", error));
    }
    catch(error) {
	console.log("Error on image retrieve: %s", error);
    }
    return {
	
	authorized(callback) {
	    if(callback)
		return Auth.checkImageAccess(callback);
	    return false;
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
	    return Config.imageUrl() + "/" + id
	}
    }
})()
