var cheerio = require('cheerio');
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback)
{
    RequestStore.get('https://store.steampowered.com/sale/lunarnewyear2020', function (error, response, html) {
        var $ = cheerio.load(html);
        var authwgtoken = JSON.parse($("#application_config").attr("data-userinfo"));
        if(authwgtoken == ""){
            console.log(options.accountPretty + " error no authwgtoken");
            callback();
        }else{
            RequestStore.post({
                url:'https://store.steampowered.com/saleaction/ajaxopendoor', 
                form: { sessionid: SessionID, authwgtoken: authwgtoken, door_index: 0}
            }, function (error, response, body){
                try {
                    var res = JSON.parse(body);
                    if(res.success){
                        console.log(options.accountPretty + " done, message", res.rewards.length > 0? res.rewards : null);
                    }else{
                        console.log(options.accountPretty + " error somfing went wrong", res);
                    }
                } catch (error) {
                    console.log(options.accountPretty + " error somfing went wrong, many allready run this account?? (will skip and run next)", body);
                }
                callback();
            })
        }
    })    
}

/*xpr_prsnlzdslpg_wsh=6; xpr_prsnlzdslpg_ir=66; xpr_prsnlzdslpg_dlc=81;*/