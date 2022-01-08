var cheerio = require('cheerio');
// the sub id is not the app id, bot the id from the "add to account" button from the store page 
// you can find the sub id, by finding the game on https://steamdb.info/ and then under "packages" you can see the subids. ( the it the one call "Free on Demand")
// steamdb have a list of free app ( sub ids ) that can be activated. here is a eks, from the day i crate this. where i have just copy and paste the list in here.
var subIds = [
    //add the ids here, as a list
];
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    for (let i = 0; i < subIds.length; i++) {
        const subid = subIds[i];
        await ActivateGame(RequestStore, SessionID, options, subid);
        console.log(options.accountPretty + " "+i);
    }
    callback();
}

function ActivateGame(RequestStore, SessionID, options, subid) {
    return new Promise(function (resolve) {
        RequestStore.post({
            url: "https://store.steampowered.com/checkout/addfreelicense/",
            form:{
                action: 'add_to_cart',
                subid: subid,
                sessionid: SessionID
            }
        }, function (error, response, body) {
            var $ = cheerio.load(body);
            console.log(options.accountPretty + " subid:" + subid + " - status: " + $(".checkout_tab.checkout_content h2").html())
            setTimeout(function () {
                resolve();
            }, 500);
        })
    })
    
}