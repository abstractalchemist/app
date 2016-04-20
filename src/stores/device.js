export default (function() {
    return {
	mobile() {
	    return window.matchMedia('only screen and (max-width: 760px)').matches;
	}
    }
})()
