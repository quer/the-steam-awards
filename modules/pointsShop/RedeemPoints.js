var cheerio = require('cheerio');
var listToRedeem = [
    260626,
    260627,
    260628
]

module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    var token = await GetAccessToken();
    for (let i = 0; i < listToRedeem.length; i++) {
        const itemToRedeem = listToRedeem[i];
        try {
            await RedeemPoints(itemToRedeem);            
        } catch (error) {
            options.log(error);
        }
    }
    callback();

    function RedeemPoints(itemId) {
        return new Promise(function (resolve) {           
            RequestStore.post({
                url: "https://api.steampowered.com/ILoyaltyRewardsService/RedeemPoints/v1?access_token=" + token,
                form: { "defid" : itemId }
            }, function (Err, HttpResponse, Body) {
                resolve();
            });
        })
    }
    function GetAccessToken() {
        return new Promise(function (resolve, reject) {
            RequestStore.get('https://store.steampowered.com/points/shop', function (error, response, html) {
                try {
                    var $ = cheerio.load(html);
                    var loyaltystore = JSON.parse($("#application_config").attr("data-loyaltystore"));
                    resolve(loyaltystore.webapi_token);
                    return;
                } catch (error) {
                    reject(error);
                    return;
                }
            });
        })
    }
}



