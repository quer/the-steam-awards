var appid = 570;
var comment = "Great game!";
var createRecommend = true;
var deleteRecommend = true;

module.exports = function(steamClient, _requestCommunity, _requestStore, sessionID, options, callback){
    Promise.resolve().then(function () {
        if(createRecommend)
        {
            return Make(_requestStore, sessionID);
        }
        else
        {
            return;
        }
    })
    .then(function () {
        
        if(deleteRecommend)
        {
            return removeMake(_requestCommunity, sessionID, steamClient.steamID);
        }
        else
        {
            return;
        }
    })
    .then(function () {
        callback();
    })
    .catch(function (error) {
        console.log("error", error);
        callback();
    })

};


function Make(_requestStore, sessionID) {
    return new Promise(function (resolve, reject) {
        
        var url = 'https://store.steampowered.com/friends/recommendgame';
        var form = {
            appid: appid,
            comment: comment,
            disable_comments: 1,
            is_public: false,
            language: "english",
            rated_up: true,
            received_compensation: 0,
            sessionid: sessionID,
            steamworksappid: appid
        }

        _requestStore.post({
            url: url,
            form: form
        }, function (error, response, body) {
            setTimeout(function () {
                if(error){
                    reject(error);
                }else{
                    console.log("created");
                    console.log(body);
                    resolve();
                }
            }, 2000);
        });
    })
    
}
function removeMake(_requestCommunity, sessionID, steamID) {
    return new Promise(function (resolve, reject) {
        _requestCommunity.post({
            url: 'https://steamcommunity.com/profiles/'+steamID+'/recommended/',
            form: {
                action: "delete",
                sessionid: sessionID,
                appid: appid
            }
        }, function (error, response, body) {
            if(error){
                reject(error);
            }else{
                console.log("fjerenet");
                //console.log(body);
                setTimeout(function () {
                    resolve();
                }, 2000);
            }
        })
    })
}