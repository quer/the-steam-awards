var appsToFollow = [
]
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < appsToFollow.length; i++) {
        const appId = appsToFollow[i];
        try {        
            await FollowGame(appId);
        } catch (error) {
            options.logError(options.accountPretty+" error Following Game, and will be skipped, appid: " + appId);
            options.logError(error)
        }
    }
    callback();
    
    function FollowGame(appId) {
        return new Promise(function (resolve, reject) {
            RequestStore.post({
                url: "https://store.steampowered.com/explore/followgame/",
                form:{
                    appid: appId,
                    sessionid: SessionID
                }
            }, function (error, response, body) {
                if(error) {
                    reject(error)
                    return;
                }
                if(body == "true") {
                    resolve();
                    return;
                }
                reject();
            });
        })
    }
}
