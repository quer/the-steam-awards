//a list of all the steam account to add as friends
var steamIds = ["xxx", "76561197990233572", "xxx"]

module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
	var log = options.log;
	var logError = options.logError;
    for (let i = 0; i < steamIds.length; i++) {
        const steamid = steamIds[i];
        try {
            await AddFriend(steamid)            
        } catch (error) {
            logError(`somefing went wrong, add '${steamid}' as frind. error: `, error);
        }
    }
    callback();
    function AddFriend(steamId) {
        return new Promise(function (resolve, reject ) {
            RequestCommunity.post({
                url: "https://steamcommunity.com/actions/AddFriendAjax",
                form:{
                    sessionID: SessionID,
                    steamid: steamId,
                    accept_invite: 0
                }
            }, function (error, response, body) {
                if(error){
                    reject(error);
                    return;
                }
                try {
                    var bodyJson = JSON.parse(body);
                    if(bodyJson.success == 1){
                        log("added " + bodyJson.invited);
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


