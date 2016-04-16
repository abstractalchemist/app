import Utils from '../utils'

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
	    return "http://localhost:3000/anime/images/" + id
	}
    }
})()
