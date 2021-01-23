
// this will select a random profile avatar, from the games owned. 
var helper = require('./chanceAccountHelper')
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var avarats = await GetAvatars(RequestCommunity);
    if(avarats != null){
        var games = avarats.rgOtherGames;
        var randomGame = helper.GetRandomFromList(games);
        var randomGameAvatar = helper.GetRandomFromList(randomGame.avatars);
        console.log(randomGame.appid + " - " + randomGameAvatar.ordinal);
        RequestCommunity.post({uri: "https://steamcommunity.com/ogg/"+ randomGame.appid +"/selectAvatar", form: { sessionid: SessionID, json: 1, selectedAvatar: randomGameAvatar.ordinal}}, function(error, response, body) {
            var returnJson = JSON.parse(body); // {success: 1, errmsg: ""}
            if(returnJson.success == 1){
                console.log(options.accountPretty+ " Setting chanced!");
            }else{
                console.log(options.accountPretty+ " Error saving avatar! Error:" + errmsg);
            }
            callback();
        });
    }else{
        callback();
    }
}

function GetAvatars(RequestCommunity) {
    return new Promise(function (resolve) {
        RequestCommunity.get({ uri: "https://steamcommunity.com/actions/GameAvatars/?json=1&l=english" }, function(error, response, body) {
            resolve(JSON.parse(body));
        })
    })
}


// to upload a image, you have to post to 
// https://steamcommunity.com/actions/FileUploader/
// whit form obj:
/**
    avatar: (binary)
    type: player_avatar_image
    sId: (steam 64 id)
    sessionid: ( sessionid )
    doSub: 1
    json: 1
 */
// the avatar as binary, i am not sure how it has converted the uploaded image into a binary. might look into, if some need it. 