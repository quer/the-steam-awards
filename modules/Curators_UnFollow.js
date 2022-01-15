//this file look the same as "FollowCurators.js", but the request have a "follow: 0". 
var CuratorIds = [
    33075774,
    40954427
]
var timeBetweenEachRequest = 2000; //2sec
var logError = () => {};
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
	logError = options.logError;
    for (let i = 0; i < CuratorIds.length; i++) {
        const clanid = CuratorIds[i];
        try {        
            await UnFollowCurator(RequestStore, SessionID, clanid);
        } catch (error) {
            logError(options.accountPretty+" error Following Curator, and will be skipped, CuratorId: "+clanid);
            logError(error)
        }
        await Wait(timeBetweenEachRequest);
    }
    callback();
}

function UnFollowCurator(RequestStore, SessionID, clanid) {
    return new Promise(function (resolve, reject) {
        RequestStore.post({
            url: "https://store.steampowered.com/curators/ajaxfollow",
            form:{
                clanid: clanid,
                sessionid: SessionID,
                follow: 0
            }
        }, function (error, response, body) {
            if(error){
                reject(error)
                return;
            }
            try {
                var response = JSON.parse(body)
                if(response.success.success == 1){
                    resolve();
                    return;
                }
            } catch (error) {
                
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