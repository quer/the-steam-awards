
var ach = require('../Edit Profile/chanceAccountHelper')
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var ss = await ach.GetAccountInfo(RequestCommunity)
    options.log(ss.ProfileEdit);
    options.log(ss.ProfileBadges.FavoriteBadge);
    
    await JoinGroup("https://steamcommunity.com/groups/156as8464w3")
    
    callback();

    function JoinGroup(groupUrl) {
        return new Promise(function (resolve, reject) {
            RequestCommunity.request.post({
                url: groupUrl,
                form:{
                    sessionID: SessionID,
                    action: "join"
                },
                json: true
            }, function (error, response, body) {
                if(error){
                    reject(error);
                    return
                }
                resolve();
            });
        })
    }
};
