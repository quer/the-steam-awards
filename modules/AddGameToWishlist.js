var list = [823500, 730, 570]; // List
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
	//TODO: this shoud be unasigned later
	RequestStore.jar().setCookie('snr=1_4_4__118|https%3A%2F%2Fstore.steampowered.com%2Fapi%2Faddtowishlist; expires=Wed, 11 Dec 2019 13:23:14 GMT;path=/', 'https://store.steampowered.com');
	var loop = function (index, end_callback) {
		if(list.length > index){
			RequestStore.post({
		        url: url,
		        form:{
		            appid: list[index],
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
