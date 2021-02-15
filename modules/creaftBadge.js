module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestCommunity.post({
        url: "https://steamcommunity.com/profiles/"+steamClient.steamID+"/ajaxcraftbadge/",
        form:{
            appid: 525290, // the app id for the game to create for. 
            series: 1, // unknown
            border_color: 0, // foil ( 0: normal, 1 : foil)
            levels: 1, // amount ( eks craft 3 levels at once)
            sessionid: SessionID
        }
    }, function (Err, HttpResponse, Body) {
        callback();
    });
}



