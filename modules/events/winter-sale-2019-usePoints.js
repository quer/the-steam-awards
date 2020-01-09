var cheerio = require('cheerio');
var randomItemToGet = [6,23,77,72,35,34,33,32,31,30,29,28,27,26,25,24,22,7,21,20,19,18,17,16,15,14,13,12,11,10,9,8,78]; // price must be 100, else chacne the code
var usedItems = [];
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    usedItems = [];
    getPoints(RequestStore, function (points) {
        console.log(steamClient.steamID + " - " + options.UserName + " points:"+ points);
        Loop(points, 0, RequestStore, SessionID, function () {
            callback();            
        })
    })
};
function Loop(loops, loop, RequestStore, SessionID, callback) {
    if(loops > loop){
        getItem(RequestStore, SessionID,function () {
            Loop(loops, loop + 100, RequestStore, SessionID, callback)
        });
    }else{
        callback();
    }
}
function getPoints(RequestStore, callback) {
    RequestStore.get('https://store.steampowered.com/holidaymarket', function (error, response, body) {
        var $ = cheerio.load(body);
        callback($(".rewards_tokens_amt").html());
    })
}
function getItem(RequestStore, SessionID, callback) {
    RequestStore.post(
        {
            url:'https://store.steampowered.com/holidaymarket/ajaxredeemtokens/', 
            form: { sessionid: SessionID, itemid: GetItemID() }
        }, function (error, response, body){
            var data = JSON.parse(body);
            console.log(data);
            if(data.success){
                callback();
            }else{
                console.log('error getting item, will retry');
                setTimeout(() => {
                    getItem(RequestStore, SessionID, callback)
                }, 1000);
            }
        })
}
function GetItemID() {
    var freeItem = null;
    while (freeItem == null) {
        var item = randomItemToGet[Math.floor(Math.random() * randomItemToGet.length)];
        if(usedItems.indexOf(item) == -1){
            usedItems.push(item)
            freeItem = item;
        }
    }
    return freeItem;
}