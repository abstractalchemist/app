const base = "http://localhost:3000"

export default (function() {
    return {
	get() {
	    return $.ajax({ url: base + "/anime",
			    method: "GET",
			    beforeSend: (xhr, other) => {
				let jwt = {};
				if(jwt = window.sessionStorage.getItem("jwt")) 
				    xhr.setRequestHeader("Authorization", "Bearer " + jwt);
			    }});
	    //return [{title:"Getting Started", entry : "", img:"getting-started.jpg"},
	//	    {title:"The Perfect Insider", entry: ""}];
	}
    }
})()
