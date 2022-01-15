var cheerio = require('cheerio');
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestStore.get('https://store.steampowered.com/points/shop', function (error, response, html) {
        var $ = cheerio.load(html);
        var loyaltystore = JSON.parse($("#application_config").attr("data-loyaltystore"));
        if(loyaltystore == null || !loyaltystore.summary || !loyaltystore.summary.summary || !loyaltystore.summary.summary.points){
            options.log(" error no point, to find! response where it shoud have been:", $("#application_config").attr("data-loyaltystore"));
        }else{
            options.log("have '"+ loyaltystore.summary.summary.points +"' points")
        }
        callback();
    });
}