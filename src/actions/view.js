import Dispatcher from '../util/dispatcher'

export default (function() {

    let _view = id => {
	Dispatcher.dispatch({actionType: 'viewChanged', view:id});
    };
    
    return {
	animeId() {
	    return 'anime';
	},
	programmingId() {
	    return 'programming';
	},
	samplesId() {
	    return 'samples';
	},
	imagesId() {
	    return 'images';
	},
	searchId() {
	    return 'search';
	},
	frcId() {
	    return 'frc';
	},
	frontId() {
	    return 'front';
	},
	conventionId() {
	    return 'convention';
	},
	anime() {
	    _view(this.animeId());
	},
	programming() {
	    _view(this.programmingId());
	},
	samples() {
	    _view(this.samplesId());
	},
	images() {
	    _view(this.imagesId());
	},
	search() {
	    _view(this.searchId());
	},
	frc() {
	    _view(this.frcId());
	},
	front() {
	    _view(this.frontId());
	},
	convention() {
	    _view(this.conventionId());
	},
	view(id) {
	    
	    _view(id);
	}
    }
})();
