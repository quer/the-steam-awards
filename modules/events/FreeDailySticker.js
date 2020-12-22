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
                url:'https://api.steampowered.com/ISaleItemRewardsService/ClaimItem/v1?access_token='+ authwgtoken.webapi_token, 
                form: { 
                    input_protobuf_encoded: {}
                }
            }, function (error, response, body){
                var jsonResonse = JSON.parse(body);
                if( jsonResonse.response && 
                    jsonResonse.response.reward_item && 
                    jsonResonse.response.reward_item.internal_description){
                    var next_claim_time = new Date();
                    next_claim_time.setTime((jsonResonse.response.next_claim_time * 1000))
                    console.log(options.accountPretty + " - done - item:" + jsonResonse.response.reward_item.internal_description);
                    console.log(options.accountPretty + " - next_claim_time:" + next_claim_time.toString());
                }else{
                    console.log(options.accountPretty + " - something went wrong, responce:", body);
                }
                callback();
            });
        }
    });
}