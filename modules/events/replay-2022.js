module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var steamId = steamClient.steamID;
    RequestStore.get({uri: `https://store.steampowered.com/replay/${steamId}/2022`}, function(error, response, body) {
        callback();
    })
};