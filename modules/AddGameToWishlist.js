var list = [239140, 1195460, 649950, 493520, 1174180]; // List
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
	//TODO: this shoud be unasigned later
	RequestStore.jar().setCookie('snr=1_4_4__118|https%3A%2F%2Fstore.steampowered.com%2Fapi%2Faddtowishlist; expires=Wed, 11 Dec 2019 13:23:14 GMT;path=/', 'https://store.steampowered.com');
	var loop = function (index, end_callback) {
		if(list.length > index){
			var app = list[index];
			RequestStore.jar().setCookie('wants_mature_content=1; expires=Thu, 10 Dec 2020 16:57:37 GMT;path=/app/' + app, 'https://store.steampowered.com');
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
