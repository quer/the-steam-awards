var cheerio = require('cheerio');
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    FolloworignoreEvent(RequestStore, SessionID, 1, function () {
        FolloworignoreEvent(RequestStore, SessionID, 2, function () {
            FolloworignoreEvent(RequestStore, SessionID, 3, function () {
                UnfolloworunignoreEvent(RequestStore, SessionID, 0, function () {
                    callback();
                })
            })
        })
    })
};

function FolloworignoreEvent(RequestStore, SessionID, notification_flag, callback) {
    var url = "https://store.steampowered.com/events/followorignoreevent";
    event(RequestStore, SessionID, notification_flag, url, callback);
}
function UnfolloworunignoreEvent(RequestStore, SessionID, notification_flag, callback) {
    var url = "https://store.steampowered.com/events/unfolloworunignoreevent";
    event(RequestStore, SessionID, notification_flag, url, callback);
}

function event(RequestStore, SessionID, notification_flag, url, callback) {
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