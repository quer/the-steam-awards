var cheerio = require('cheerio');
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestStore.get('https://store.steampowered.com/points/shop', function (error, response, html) {
        var $ = cheerio.load(html);
        var authwgtoken = JSON.parse($("#application_config").attr("data-loyaltystore"));
        if(authwgtoken == null || !authwgtoken.webapi_token){
            console.log(options.accountPretty + " error no authwgtoken");
            callback();
        }else{
            RequestStore.post({
                url:'https://api.steampowered.com/ISummerSale2020Service/ClaimItem/v1?access_token='+ authwgtoken.webapi_token, 
                form: { 
                    input_json: {}
                }
            }, function (error, response, body){
                var jsonResonse = JSON.parse(body);
                if(jsonResonse.response && jsonResonse.response.item_name){
                    console.log(options.accountPretty + " - done - item:" + jsonResonse.response.item_name);
                }else{
                    console.log(options.accountPretty + " - something went wrong, responce:", body);
                }
                callback();
            });
        }
        });
        //RequestStore.Get("d98009af3bc71f16f10914118d7f0b39")
}