module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var url = "https://steamcommunity.com/profiles/"+steamClient.steamID+"/ajaxclearaliashistory";
    var formData = {
        sessionid: SessionID
    }
    RequestCommunity.post({uri: url, formData: formData}, function(error, response, body) {
        var respons = JSON.parse(body);
        if(respons && respons.success){
            options.log(" - Cleared Alias");
        }else{
            options.logError(" - Failed to clear Alias");
        }
        callback();
    });
}