
var ach = require('../Edit Profile/chanceAccountHelper')
module.exports = async function(steamConnection, _request, sessionID, options, callback){
    var ss = await ach.GetAccountInfo(_request)
    options.log(ss.ProfileEdit);
    options.log(ss.ProfileBadges.FavoriteBadge);
    
    steamConnection.GetSteamUser()
    .then(function (steamUser) {
        steamUser.gamesPlayed([{ game_id: 730 }]);
    })
    .then(function () {
        return new Promise((res) => setTimeout(() => res(), 10000));
    })
    .then(function () {
        return steamConnection.GetSteamUser();
    })
    .then(function (steamUser) {
        steamUser.gamesPlayed([{ game_id: 520 }]);
    })
    .then(function () {
        return new Promise((res) => setTimeout(() => res(), 10000));
    })
    .then(callback)
    .catch(function (e) {
        options.log("error");
        options.log(e);
    })
};
