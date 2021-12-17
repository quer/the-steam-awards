//this file look the same as "FollowGame.js", but the request have a "unfollow: 1". 
var appsToUnFollow = [
    730,
    440
]
var timeBetweenEachRequest = 2000; //2sec
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < appsToUnFollow.length; i++) {
        const appId = appsToUnFollow[i];
        try {        
            await FollowGame(RequestStore, SessionID, appId);
        } catch (error) {
            console.log(options.accountPretty+" error Following Game, and will be skipped, appid: "+appId);
            console.log(error)
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
function Wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time)
    });
}