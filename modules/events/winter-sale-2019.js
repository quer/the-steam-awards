var cheerio = require('cheerio');
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    quest1(RequestStore, function () {
        quest2(function () {
            //quest3 is from a other module
            quest4(RequestStore, function () {
                quest5(RequestStore, SessionID, function () {
                    quest6(RequestStore, callback);
                })
            })
        })
    })
};
function quest1(RequestStore, callback) {
    var url = "https://store.steampowered.com/recommender";
    RequestStore.get(url, function (error, response, body){
        callback();
    })
}
function quest2(callback) {
    // will some soon
    var friendToChatTo = "xxxx";
    callback();
}
function quest4(RequestStore, callback) {
    var url = "https://store.steampowered.com/labs/divingbell";
    RequestStore.get(url, function (error, response, body){
        callback();
    })
}
function quest5(RequestStore, SessionID, callback) {
    RequestStore.post(
        {
            url:'https://store.steampowered.com/holidayquests/ajaxclaimitem/', 
            form: { sessionid: SessionID, type: 1 }
        }, function (error, response, body){
            var data = JSON.parse(body);
            if(data.success){
                callback();
            }else{
                console.log('error getting free token');
                callback();
            }
        })
}
function quest6(RequestStore, callback) {
    var url = "https://steam.tv/yulelog";
    RequestStore.get(url, function (error, response, body){
        callback();
    })
}