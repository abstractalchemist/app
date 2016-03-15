import Utils from '../utils'

export default (function() {
    
    return {
	authorized() {
	    return Rx.Observable.fromPromise($.ajax(Utils.get("/frc/authorized")));
					    
	}
    }
})()
