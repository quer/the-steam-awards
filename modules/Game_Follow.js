var appsToFollow = [
    730,
    440
]
var timeBetweenEachRequest = 2000; //2sec
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < appsToFollow.length; i++) {
        const appId = appsToFollow[i];
        try {        
            await FollowGame(RequestStore, SessionID, appId);
        } catch (error) {
            options.logError(options.accountPretty+" error Following Game, and will be skipped, appid: " + appId);
            options.logError(error)
        }
        await Wait(timeBetweenEachRequest);
    }
    callback();
}

function FollowGame(RequestStore, SessionID, appId) {
    return new Promise(function (resolve, reject) {
        RequestStore.post({
            url: "https://store.steampowered.com/explore/followgame/",
            form:{
                appid: appId,
                sessionid: SessionID
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
function Wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time)
    });
}