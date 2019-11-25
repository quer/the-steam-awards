var list = [
    
];
var ss = `russian`;
var i = 0;
var steamid= "76561198036793040";
var url = "https://steamcommunity.com/comment/Profile/post/"+steamid+"/-1/";
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestCommunity.post({
        url: url,
        form:{
            comment: ss,
            count: 6,
            sessionid: SessionID,
            feature2: -1
        }
    }, function (error, response, body) {
        console.log(body);
        ++i;
        setTimeout(function () {
            callback();
        }, 500);
    });
};
