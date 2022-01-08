//UserReceivedNewGame_{steamid}_{userNewGameId}
var steamid = "76561198067646546";
var userNewGameId = "1604111664";

var url = "https://steamcommunity.com/comment/UserReceivedNewGame/voteup/"+ steamid +"/"+ userNewGameId +"/";

module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestCommunity.post({
        url: url,
        form:{
            vote: 1,
            count: 3,
            sessionid: SessionID,
            feature2: -1,
            newestfirstpagination: true
        }
    }, function (error, response, body) {
        console.log(body);
        setTimeout(function () {
            callback();
        }, 500);
    });
};