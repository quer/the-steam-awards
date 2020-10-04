var cheerio = require('cheerio');
var subid = 499398; // this is not the app id, bot the id from the "add to account" button from the store page
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestStore.post({
        url: "https://store.steampowered.com/checkout/addfreelicense/",
        form:{
            action: 'add_to_cart',
            subid: subid,
            sessionid: SessionID
        }
    }, function (error, response, body) {
        var $ = cheerio.load(body);
        console.log(options.accountPretty + " " + $(".checkout_tab.checkout_content h2").html())
        setTimeout(function () {
            callback();
        }, 500);
    })
}