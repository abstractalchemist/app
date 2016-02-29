define([], () => {
    console.log("loading data");
    const base = "";
    return {
	anime() {
	    return $.ajax("/content/anime", { method : "GET" });
	}
    }

});
