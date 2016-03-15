export default (function() {

    let base = "http://localhost:3000";
    
    return {
	get(url) {
	    return { url: base + url,
		     method : "GET",
		     beforeSend : xhr => {
			 let jwt;
			 if(jwt = window.sessionStorage.getItem('jwt'))
			     xhr.setRequestHeader("Authorization", "Bearer " + jwt);
		     }
		   };
	},
	post(url, data) {
	    return { url: base + url,
		     method: "POST",
		     contentType: "application/json",
		     beforeSend: xhr => {
			 let jwt;
			 if(jwt = window.sessionStorage.getItem('jwt'))
			     xhr.setRequestHeader('Authorization', 'Bearer ' + jwt);
		     },
		     data: data
		   }
	}
    }
})()
