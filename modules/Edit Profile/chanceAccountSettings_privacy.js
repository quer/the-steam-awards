var SettingMode = {
    Privat: 1,
    FriendsOnly: 2,
    Public: 3
}

var settings = {
    "PrivacyProfile": SettingMode.Public,
    "PrivacyInventory": SettingMode.Public,
    "PrivacyInventoryGifts": SettingMode.Public, // can only be "Privat" or "Public"
    "PrivacyOwnedGames": SettingMode.Public,
    "PrivacyPlaytime": SettingMode.Public, // can only be "Privat" or "Public"
    "PrivacyFriendsList": SettingMode.Public,
}

module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var url = "https://steamcommunity.com/profiles/"+steamClient.steamID+"/ajaxsetprivacy";
    var formData = {
        sessionid: SessionID,
        Privacy: JSON.stringify(settings),
        eCommentPermission: 1
    }
    RequestCommunity.post({uri: url, formData: formData}, function(error2, response2, body2) {
       console.log(body2)
        callback();
    });
}