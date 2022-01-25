var filesToLike  = ["2658116668", "2658140590"];
var log = () => {};
var logError = () => {};
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){	
    log = options.log;
	logError = options.logError;
    for (let i = 0; i < filesToLike.length; i++) {
        const fileToLike = filesToLike[i];
        await Like(RequestCommunity, SessionID, fileToLike);
    }
    callback();
}
function Like(RequestCommunity, SessionID, appid) {
    return new Promise(function (resolve) {
        RequestCommunity.post({
            url: "https://steamcommunity.com/sharedfiles/voteup",
            form: {
                id: appid,
                sessionid: SessionID,
            }
        }, function (error, response, body) {  
            log(body);
            setTimeout(function () {
                resolve();
            }, 500);
        });
    })
}