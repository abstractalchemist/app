export default (function() {

    let base = "http://localhost:3000";
    
    return {
	images() {
	    return $.ajax({url: base + "/anime/images",
			   method: "GET",
			   beforeSend: xhr => {
			       let jwt = {};
			       if(jwt = window.sessionStorage.getItem("jwt")) {
				   xhr.setRequestHeader("Authorization", "Bearer " + jwt);
			     }
			   }})
	}
    }
    
})()
