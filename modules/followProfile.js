var followTypes = {
    "follow": 1, 
    "unfollow": 2
}

var steamIds = [
    { account: "76561197990233572", mode: followTypes.follow },
    { account: "64-bit SteamID", mode: followTypes.unfollow }
    ...
];

module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
	var log = options.log;
	var logError = options.logError;
    for (let i = 0; i < steamIds.length; i++) {
        const steamId = steamIds[i];
        await makeRequest(steamId.account, steamId.mode == followTypes.follow);
    }
    callback();

    function makeRequest(steamId, follow) {
        return new Promise(function (resolve) {
            var Url = "https://steamcommunity.com/profiles/" + steamId + "/" + (follow ? "followuser" : "unfollowuser");
            RequestCommunity.post({
                url: Url,
                form:{
                    sessionid: SessionID,
                    steamid: steamId
                }
            }, function (error, response, body) {
                var jsonRespone = JSON.parse(body);
                if(jsonRespone.success && jsonRespone.success == 1){
                    log(" - done ");
                }else{
                    logError(" - something went wrong, responce: ", body);
                }
                resolve();
            });
        });   
    }
};

