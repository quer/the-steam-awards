module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var pageIndex = 0;
    var wishlistApps = [];
    //get app on the wishlist
    do {
        var PageApps = await GetPages(RequestStore, steamClient.steamID, pageIndex);
        wishlistApps = wishlistApps.concat(PageApps)
        pageIndex += 1;
    } while (PageApps.length > 0);
    //remove apps 
    console.log("Removing "+ wishlistApps.length + " apps from wishlist");
    for (let i = 0; i < wishlistApps.length; i++) {
        const appid = wishlistApps[i];
        try {
            await RemoveGame(RequestStore, SessionID, steamClient.steamID, appid);
        } catch (error) {
            console.error(`somefing went wrong, removing '${appid}' from the wishlist. error: `, error);
        }
    }
    callback();
}
function GetPages(RequestStore, steamID, pageIndex) {
	return new Promise(function (resolve, reject) {
        RequestStore.get("https://store.steampowered.com/wishlist/profiles/"+steamID+"/wishlistdata/?p=" + pageIndex, function (err, response, body) {
            var jsonObj = JSON.parse(body);
            var apps = [];
            for (var k in jsonObj) {
                if (jsonObj.hasOwnProperty(k)) {
                    apps.push(k);
                }
            }
            resolve(apps)
        });
    });
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
