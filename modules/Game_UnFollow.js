//this file look the same as "FollowGame.js", but the request have a "unfollow: 1". 
var appsToUnFollow = [
]
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < appsToUnFollow.length; i++) {
        const appId = appsToUnFollow[i];
        try {        
            await FollowGame(appId);
        } catch (error) {
            options.logError(" error Following Game, and will be skipped, appid: " + appId);
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
                    sessionid: SessionID,
                    unfollow: 1
                }
            }, function (error, response, body) {
                if(error){
                    reject(error)
                    return;
                }
                if(body == "true"){
                    resolve();
                    return;
                }
                reject();
            });
        })
    }

}
