module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    if(!options.loop) {
        options.loop = 0;
    }
    //console.log(options.loop + " - start");
    RequestCommunity.post({uri: "https://steamcommunity.com/profiles/"+ steamClient.steamId +"/ajaxgroupinvite?select_primary=1&json=1"}, function (error, response, body) {
        var amount = null;
        try {
            var jsonObj = JSON.parse(body);
            amount = jsonObj.length;
        } catch (error) {
            
        }
        setTimeout(function () {
            options.log(options.loop + " - " + amount + " - end");
            options.loop += 1;
            callback();
        }, 5000);
    });
}