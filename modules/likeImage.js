var cheerio = require('cheerio');
var fileToLike = "1872654892";
var appid = "1128000";
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestCommunity.get("https://steamcommunity.com/sharedfiles/filedetails/?id=" + fileToLike, function (error, response, body) {  
        RequestCommunity.post({
            url: "https://steamcommunity.com/sharedfiles/voteup",
            form:{
                sessionid: SessionID,
                id: fileToLike
            }
        }, function (error, response, body) {
            console.log(body);
            RequestCommunity.post({
                url: "https://steamcommunity.com/sharedfiles/favorite",
                form:{
                    sessionid: SessionID,
                    id: fileToLike,
                    appid: appid
                }
            }, function (error, response, body) {
                console.log(body);
                setTimeout(function () {
                    callback();
                }, 500);
            });
        });
    })
}