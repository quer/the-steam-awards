var list = [730]

module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){	
    var log = options.log;
	var logError = options.logError;
    for (let i = 0; i < list.length; i++) {
        const appid = list[i];
        try {
            await removeMake(appid);
        } catch (error) {
            logError(`somefing went wrong, removing recommendation to appid '${appid}'. error: `, error);
        }
    }
    callback();
    function removeMake(appid) {
        return new Promise(function (resolve, reject) {
            RequestCommunity.post({
                url: 'https://steamcommunity.com/profiles/'+ steamClient.steamID +'/recommended/',
                form: {
                    action: "delete",
                    sessionid: SessionID,
                    appid: appid
                }
            }, function (error, response, body) {
                if(error){
                    reject(error);
                    return;
                }
                // we cant use the "body" to see if it was removed or not. as it will return almost empty html..
                log("Removed recommendation to app: " + appid);
                resolve();
                return;
            })
        })
    }
};

