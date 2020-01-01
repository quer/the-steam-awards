var list = [239140, 1195460, 649950]; // List
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
	//TODO: this shoud be unasigned later
	RequestStore.MakeNavCookie('1_4_4__118', 'https://store.steampowered.com/api/addtowishlist');
	RequestStore.mature_content();
	var loop = function (index, end_callback) {
		if(list.length > index){
			var app = list[index];
			//RequestStore.jar().setCookie('wants_mature_content=1; expires=Thu, 10 Dec 2020 16:57:37 GMT;path=/app/' + app, 'https://store.steampowered.com');
			RequestStore.post({
		        url: "https://store.steampowered.com/api/addtowishlist",
		        form:{
		            appid: app,
		            sessionid: SessionID
		        }
		    }, function (postErr, postHttpResponse, postBody) {
		    	console.log("added: " + list[index]);
		        loop(++index, end_callback);
		    });
		}else{
	    	console.log("done whit a steam user");
			end_callback();
		}
	}
    loop(0, callback);
}
