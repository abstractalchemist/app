import Dispatcher from '../util/dispatcher'

export default (function() {
    return {
	newAnimePost(data) {
	    console.log("Submit new post");
	    Dispatcher.dispatch({ actionType: 'newAnimePost', data: data });
	},
	updateAnimePost(data) {
	    Dispatcher.dispatch({ actionType: 'updateAnimePost', data: data});
	}
    }
})()
