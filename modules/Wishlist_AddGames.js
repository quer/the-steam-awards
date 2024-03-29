var AppList = [

];
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
	//TODO: this shoud be unasigned later
	RequestStore.MakeNavCookie('1_4_4__118', 'https://store.steampowered.com/api/addtowishlist');
	RequestStore.mature_content();
	for (let i = 0; i < AppList.length; i++) {
		const appid = AppList[i];
		try {
			await AddGame(RequestStore, SessionID, appid);
		} catch (error) {
            options.logError(`somefing went wrong, add '${appid}' to wishlist. error: `, error);
        }
	}
	callback();
	function AddGame(RequestStore, SessionID, appID) {
		return new Promise(function (resolve, reject) {
			RequestStore.post({
				url: "https://store.steampowered.com/api/addtowishlist",
				form:{
					appid: appID,
					sessionid: SessionID
				}
			}, function (error, response, body) {
				if(error){
					reject(error);
					return;
				}
				try {
					var bodyJson = JSON.parse(body);
					if(bodyJson.success){
						options.log("Added: " + appID);
						resolve();
					}else{
						throw new Error(body);
					}
				} catch (error) {
					reject(error);
					return;
				}
			});
		})
	}	
}
