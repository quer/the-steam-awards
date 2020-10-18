module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestCommunity.post({
        url: "https://steamcommunity.com/actions/AddFriendAjax",
        form:{
            sessionID: SessionID,
            steamid: "76561197985676785",
            accept_invite: 0
        }
    }, function (error, response, body) {
        console.log(body);
        callback();
    });
}
