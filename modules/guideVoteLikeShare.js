module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var id = "923012519"; //chace for the guide id
    var appid = "753"; // must be the appid for the guide
    LoadGuide(id, function () {
        Rate(id, function () {
            Favorite(id, appid, callback)
        })
    })

    function LoadGuide(id, callback) {
        RequestCommunity.get({
            url: "https://steamcommunity.com/sharedfiles/filedetails/?id="+id
        }, function (error, response, body) {
            setTimeout(function () {
                callback();
            }, 500);
        });
    }

    function Rate(id, callback) {
        var voteUrl = "https://steamcommunity.com/sharedfiles/voteup";
        RequestCommunity.post({
            url: voteUrl,
            form:{
                sessionid: SessionID,
                id: id
            }
        }, function (error, response, body) {
            setTimeout(function () {
                callback();
            }, 500);
        });
    }

    function Favorite(id, appid, callback) {
        var url = "https://steamcommunity.com/sharedfiles/favorite";
        RequestCommunity.post({
            url: url,
            form:{
                sessionid: SessionID,
                id: id,
                appid:appid 
            }
        }, function (error, response, body) {
            setTimeout(function () {
                callback();
            }, 500);
        });   
    }
    //doent work, not sure why
    function Share(id, appid, callback) {
        var url = "https://steamcommunity.com/profiles/"+ steamClient.steamID +"/ajaxpostuserstatus/";
        RequestCommunity.post({
            url: url,
            form:{
                sessionid: SessionID,
                status_text: "\n\nhttps://steamcommunity.com/sharedfiles/filedetails/?id=" + id,
                appid:appid 
            }
        }, function (error, response, body) {
            setTimeout(function () {
                callback();
            }, 500);
        });
    }
};