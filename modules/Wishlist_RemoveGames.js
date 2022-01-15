var AppList = [];
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    options.log("Removing "+ AppList + " apps from wishlist");
    for (let i = 0; i < AppList.length; i++) {
        const appid = AppList[i];
        try {
            await RemoveGame(RequestStore, SessionID, steamClient.steamID, appid);
        } catch (error) {
            options.logError(`somefing went wrong, removing '${appid}' from the wishlist. error: `, error);
        }
    }
    callback();
}
function RemoveGame(RequestStore, SessionID, steamID, appID) {
	return new Promise(function (resolve, reject) {
		RequestStore.post({
			url: "https://store.steampowered.com/wishlist/profiles/"+ steamID +"/remove",
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
