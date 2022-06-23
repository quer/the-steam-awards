/* base on https://github.com/Revadike/Misc-JavaScript-Projects/blob/master/Steam%20Store%20-%20Cheat%20Summar%20Sale%202022%20Badge.js */
var list = [
    "https://store.steampowered.com/category/arcade_rhythm/?snr=1_614_615_clorthaxquest_1601",
    "https://store.steampowered.com/category/strategy_cities_settlements/?snr=1_614_615_clorthaxquest_1601",
    "https://store.steampowered.com/category/sports/?snr=1_614_615_clorthaxquest_1601",
    "https://store.steampowered.com/category/simulation/?snr=1_614_615_clorthaxquest_1601",
    "https://store.steampowered.com/category/multiplayer_coop/?snr=1_614_615_clorthaxquest_1601",
    "https://store.steampowered.com/category/casual/?snr=1_614_615_clorthaxquest_1601",
    "https://store.steampowered.com/category/rpg/?snr=1_614_615_clorthaxquest_1601",
    "https://store.steampowered.com/category/horror/?snr=1_614_615_clorthaxquest_1601",
    "https://store.steampowered.com/vr/?snr=1_614_615_clorthaxquest_1601",
    "https://store.steampowered.com/category/strategy/?snr=1_614_615_clorthaxquest_1601",
]
var cheerio = require('cheerio');
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback)
{
    let delay = (ms) => new Promise((res) => setTimeout(res, ms));

    try {
        var startLevel = await StartPoint(steamClient.steamID);
        if(startLevel != 10){
            options.log("account was level '" + startLevel +"' will try to get rest")
            var accountDone = false;
            var loops = 0;
            while (!accountDone) {
                
                await OpenDoor0();
                await delay(1000);
                for (let i = 0; i < list.length; i++) {
                    const link = list[i];
                    await loop(link);
                    await delay(1000);
                }
                var badgeLevel = await StartPoint(steamClient.steamID);
                if(badgeLevel != 10){
                    if(loops > 10){
                        accountDone = true;
                        options.logError("After 10 full Run's. it was not able to get the bagde to max level. Steam might be down. try agirn later.");

                    }else{
                        options.log("account was not able to get max level, it will rerun the module")
                        loops += 1;
                    }
                }else {
                    accountDone = true;
                    options.log("account now have max level");
                }
            }
        } else {
            options.log("account allready have max level")
        }

    } catch (error) {
        options.logError("Somefing happende. You have to rerun the module. if the same error happen offen, create a issue on the github page" + error);
        
    }
    callback();

    function OpenDoor0() {
        return new Promise(async function (resolve) {  
            var tokon = await getTokon();
            RequestStore.post({
                url:'https://store.steampowered.com/saleaction/ajaxopendoor', 
                form: {
                    "sessionid":      SessionID,
                    "authwgtoken":    tokon,
                    "door_index":     0,
                    "clan_accountid": 41316928
                }
            }, function (error, response, body){
                resolve();
            });
        });
    }

    function loop(link) {
        return new Promise(function (resolve) {  
            RequestStore.get({ url: link }, async function (linkError, linkResponse, linkBody){
                try {
                    var $ = cheerio.load(linkBody);
                    var capsuleinsert = $("#application_config").attr("data-capsuleinsert");
                    var capsuleinsertJson = JSON.parse(capsuleinsert);
                    var userinfo = $("#application_config").attr("data-userinfo");
                    var userinfoJson = JSON.parse(userinfo);
                    RequestStore.post({
                        url:'https://store.steampowered.com/saleaction/ajaxopendoor', 
                        form: {
                            "sessionid":      SessionID,
                            "authwgtoken":    userinfoJson.authwgtoken,
                            "door_index":     capsuleinsertJson.payload,
                            "clan_accountid": 41316928,
                            "datarecord":     capsuleinsertJson.datarecord,
                        }
                    }, function (error, response, body){
                        options.log("You got a new badge!");
                        resolve();
                    });
                } catch (error) {
                    options.log("Failed to obtain badge!. Just give it time, i will get this at some point");
                    
                    resolve();
                }
            })
        })
    }
    function getTokon() {
        return new Promise(function (resolve, reject) {  
            RequestStore.get('https://store.steampowered.com/sale/clorthax_quest', function (error, response, html) {
                var $ = cheerio.load(html);
                var authwgtoken = JSON.parse($("#application_config").attr("data-userinfo"));
                if(authwgtoken == "" || !authwgtoken.authwgtoken){
                    options.log("error no authwgtoken");
                    reject();
                }else{
                    resolve(authwgtoken.authwgtoken);
                }
            })
        })
    }
    function StartPoint(steamID) {
        return new Promise(function (resolve) {
            var url = 'https://steamcommunity.com/profiles/'+ steamID +'/badges/61';  
            RequestStore.get({ url: url }, function (error, response, body){
                try {
                    if(response.request.uri.href.split("/").reverse()[0] == '61'){
                        var $ = cheerio.load(body);
                        var ss = $(".badge_info_description div");
                        var xplevel = cheerio.load(ss[1]).text().trim().replace(" XP", "");
                        var startLevel = (parseInt(xplevel) / 25);
                        resolve(startLevel);    
                    }else{
                        resolve(0);    
                    }
                } catch (error) {
                    resolve(0);    
                }
                
            });
        });
    }
}
