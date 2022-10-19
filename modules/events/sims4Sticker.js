var cheerio = require('cheerio');
/**
 * Unlock 1 petlover
 * Unlock 2 werewolf
 * Unlock 3 sorcerer
 * Unlock 4 cozyvillager
 * Unlock 5 detective
 */
var idToUnlock = 1;
var unlockAll = false; // will just try to force unlock many at once (OBS!! will do 6 * 6 call at once. this will spam steam. so you you have many account then make a big timeout! and doent use cluster mode!)
module.exports = async function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestStore.get('https://store.steampowered.com/sale/SimsCelebrationSale?tab=2', async function (error, response, html) {
        var $ = cheerio.load(html);
        try {
            var authwgtoken = JSON.parse($("#application_config").attr("data-community")).CLANACCOUNTID;
            if(authwgtoken == ""){
                options.logError("error no authwgtoken");
                callback();
            }
            else{
                try {
                    if(!unlockAll){
                        await GetStiker(idToUnlock, authwgtoken);
                    }else{
                        var list = [];
                        for (let i = 0; i < 6; i++) {
                            list.push(GetStiker(idToUnlock, authwgtoken, true));
                            list.push(GetStiker(1, authwgtoken, true));
                            list.push(GetStiker(2, authwgtoken, true));
                            list.push(GetStiker(3, authwgtoken, true));
                            list.push(GetStiker(4, authwgtoken, true));
                            list.push(GetStiker(5, authwgtoken, true));
                        }
                        await Promise.allSettled(list);
                        await wait(10000);
                    }
                    var didGetStikker = await EnsureYouGotTheSticker();
                    if(didGetStikker > 0){
                        options.log("Did get the stikker! stikkers: " + (didGetStikker ));

                    }else{
                        options.logError("Did Not get the stikker!");

                    }
                } catch (error) {
                    options.log(error);
                }
                callback();
            }
        } catch (error) {
            options.logError("error no authwgtoken");
            callback();
        }
    });

    function GetStiker(IdToUnlock, clan_accountid, force) {
        return new Promise(function (resolve, reject) {
            var requstPost = RequestStore.post;
            if(force){
                requstPost = RequestStore.postNoneQueuePromise;
            }
            RequestStore.post({
                url: "https://store.steampowered.com/saleaction/ajaxopendoor",
                form:{
                    sessionid: SessionID,
                    door_index: IdToUnlock,
                    clan_accountid: clan_accountid
                }
            }, function (error, response, body) {
                resolve();
            });
        })
    }
    function EnsureYouGotTheSticker() {
        return new Promise(function (resolve, reject) {
            RequestStore.get('https://store.steampowered.com/sale/SimsCelebrationSale?tab=2', async function (error, response, html) {
                try {
                    var $ = cheerio.load(html);
                    var doors = JSON.parse($("#application_config").attr("data-doorinfo"));
                    options.log(doors);
                    resolve(doors.filter(x => x.opened > 0).length);
                } catch (error) {
                    resolve(0);
                }
            })
        })
    }
    function wait(ms) {
        return new Promise((resolve) => {
           setTimeout(() => resolve(), ms);
        });
     }
     
}
