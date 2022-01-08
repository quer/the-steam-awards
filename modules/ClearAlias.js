module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var url = "https://steamcommunity.com/profiles/"+steamClient.steamID+"/ajaxclearaliashistory";
    var formData = {
        sessionid: SessionID
    }
    RequestCommunity.post({uri: url, formData: formData}, function(error, response, body) {
        var respons = JSON.parse(body);
        if(respons && respons.success){
            console.log(" - Cleared Alias");
        }else{
            console.error(" - Failed to clear Alias");
        }
        callback();
    });
}