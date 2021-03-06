var steamIds = ["76561197990233572"];
var follow = true; //if false will unfollow profile
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < steamIds.length; i++) {
        const steamId = steamIds[i];
        await makeRequest(RequestCommunity, SessionID, steamId, options);
    }
    callback();
};

function makeRequest(RequestCommunity, SessionID, steamId, options) {
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
                console.log(options.accountPretty + " - done ");
            }else{
                console.log(options.accountPretty + " - something went wrong, responce: ", body);
            }
            resolve();
        });
    });
    
}