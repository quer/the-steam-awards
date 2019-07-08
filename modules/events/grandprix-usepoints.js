var cheerio = require('cheerio');
var _RequestStore;
var _SessionID;
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    _RequestStore = RequestStore;
    _SessionID = SessionID;
    RequestStore.get('https://store.steampowered.com/pitstop', function name(error, response, body) {
        var $ = cheerio.load(body);
        var points = $(".rewards_num_points").text();
        points = parseInt( points || 0 );
        console.log(points);
        if(points > 99){
            OnRedeemTokens(1002, 1, function () {
                if(points > 199){
                    OnRedeemTokens(1003, Math.floor(points / 100) - 1, callback);
                }
            })
        }else{
            callback();
        }
    })
}
function OnRedeemTokens(itemid, quantity, callback) {
    _RequestStore.post({
        url: 'https://store.steampowered.com/pitstop/ajaxredeemtokens/',
        form:{
            sessionid: _SessionID,
            itemid: itemid,
            num_badge_levels: quantity
        },
        headers: {
            'Origin': 'https://store.steampowered.com',
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer': 'https://store.steampowered.com/pitstop/'
        }
    }, function (error, response, body) {
        console.log(body);
        callback();
    });
}