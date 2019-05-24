module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var url = "https://steamcommunity.com/profiles/"+steamClient.steamID+"/ajaxsetprivacy";
    var formData = {
        sessionid: SessionID,
        Privacy: '{"PrivacyProfile":3,"PrivacyInventory":2,"PrivacyInventoryGifts":3,"PrivacyOwnedGames":3,"PrivacyPlaytime":3,"PrivacyFriendsList":2}',
        eCommentPermission: 1
    }
    RequestCommunity.post({uri: url, formData: formData}, function(error2, response2, body2) {
       console.log(body2)
        callback();
    });
}