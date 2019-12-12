var cheerio = require('cheerio');
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    //getAuthwgtoken(RequestCommunity, function (authwgtoken) { // we doent need it.
        FolloworignoreEvent(RequestStore, SessionID, 1, authwgtoken, function () {
            FolloworignoreEvent(RequestStore, SessionID, 2, authwgtoken, function () {
                FolloworignoreEvent(RequestStore, SessionID, 3, authwgtoken, function () {
                    UnfolloworunignoreEvent(RequestStore, SessionID, 0, authwgtoken, function () {
                        callback();
                    })
                })
            })
        })
    //})
};
function getAuthwgtoken(RequestStore, callback) {
    RequestStore.get('https://store.steampowered.com/sale/thegameawards', function (error, response, body) {
        var $ = cheerio.load(body);
        var dataUserInfo = JSON.parse($("#application_config").attr("data-userinfo"));
        callback(dataUserInfo.authwgtoken);
    })
}

function FolloworignoreEvent(RequestStore, SessionID, notification_flag, authwgtoken, callback) {
    var url = "https://store.steampowered.com/events/followorignoreevent";
    event(RequestStore, SessionID, notification_flag, authwgtoken, url, callback);
}
function UnfolloworunignoreEvent(RequestStore, SessionID, notification_flag, authwgtoken, callback) {
    var url = "https://store.steampowered.com/events/unfolloworunignoreevent";
    event(RequestStore, SessionID, notification_flag, authwgtoken, url, callback);
}

function event(RequestStore, SessionID, notification_flag, authwgtoken, url, callback) {
    var form = {
        sessionid: SessionID,
        authwgtoken: "not needed?",
        ignore: false,
        gid: '1702854380391140355',
        notification_flag: notification_flag,
        clan_accountid: 4
    }
    RequestStore.post({
        url: url,
        form: form
    }, function (error, response, body){
        console.log(notification_flag, body);
        callback();
    })
}