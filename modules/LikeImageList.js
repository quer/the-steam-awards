var cheerio = require('cheerio');
var fileToLike = "1872654892";
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestCommunity.post({
        url: "https://steamcommunity.com/sharedfiles/voteup",
        form: {
            id: fileToLike,
            sessionid: SessionID,
        }
    }, function (error, response, body) {  
        console.log(body);
        setTimeout(function () {
            callback();
        }, 500);
    });
    
}