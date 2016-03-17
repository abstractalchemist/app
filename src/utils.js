export default (function() {

    let base = "http://localhost:3000";
    
    return {
	get(url) {
	    return { url: base + url,
		     method : "GET",
		     beforeSend : xhr => {
			 let jwt;
			 if(jwt = window.sessionStorage.getItem('jwt'))
			     xhr.setRequestHeader("Authorization", "GoogleSignIn " + jwt);
		     }
		   };
	},
	post(url, data) {
	    return { url: base + url,
		     method: "POST",
		     contentType: "application/json",
		     processData: false,
		     beforeSend: xhr => {
			 let jwt;
			 if(jwt = window.sessionStorage.getItem('jwt'))
			     xhr.setRequestHeader('Authorization', 'GoogleSignIn ' + jwt);
		     },
		     data: JSON.stringify(data)
		   }
	}
    }
})()
