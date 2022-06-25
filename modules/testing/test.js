module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    //console.log(options.loop + " - start");
    RequestCommunity.get({uri: "https://steamcommunity.com/profiles/"+ steamClient.steamID +"/ajaxgroupinvite?select_primary=1&json=1"}, function (error, response, body) {
        var amount = null;
        try {
            var jsonObj = JSON.parse(body);
            amount = jsonObj.length;
        } catch (error) {
            
        }
        setTimeout(function () {
            options.log("test group's:" + amount + "");
            callback();
        }, 2500);
    });
}