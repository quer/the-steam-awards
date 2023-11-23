var access_token
var cheerio = require('cheerio');
var subidToActive = null; // make "null" if you know a app that the account can play, that have been voted on,
var appToPlay = 440;
var categoryToVote = [
    {"category_id": 90,  appid: 990080, source: 6 },
    {"category_id": 91,  appid: 2215130, source: 0 }, // skip
    {"category_id": 92,  appid: 440, source: 6 }, // skip
    {"category_id": 93,  appid: 2215130, source: 0 }, // skip
    {"category_id": 94,  appid: 2215130, source: 0 }, // skip
    {"category_id": 95,  appid: 2215130, source: 0 }, // skip
    {"category_id": 96,  appid: 2215130, source: 0 }, // skip
    {"category_id": 97,  appid: 2215130, source: 0 }, // skip
    {"category_id": 98,  appid: 2215130, source: 0 }, // skip
    {"category_id": 99,  appid: 2215130, source: 0 }, // skip
    {"category_id": 100,  appid: 2215130, source: 0 }, // skip
];
module.exports = async function (steamClient, RequestCommunity, RequestStore, SessionID, options, callback) {
    if (!await EnsureWeAreDone().status) {
        var token = await GetToken();
        for (let i = 0; i < categoryToVote.length; i++) {
            var voteObj = categoryToVote[i];
            await vote(token, voteObj.category_id, voteObj.appid, voteObj.source);
        }
        
        if (subidToActive != null) {
            await ActivateGame(subidToActive);
        }
        
        steamClient.gamesPlayed([{ game_id: appToPlay }]);
        let stopped = false
        while (!stopped) {
            var status = await EnsureWeAreDone();
            if(status.list[2].completed){
                stopped = true;
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * 60)); // check each 1 min. if is unlocked

        }
        steamClient.gamesPlayed([]);
        var reviewLoopTimes = 0;
        while (reviewLoopTimes < 7) {
            var status = await EnsureWeAreDone();
            if(!status.list[3].completed){
		        await removeMake(steamClient.steamID, appToPlay);
                await Make(steamClient.steamID, appToPlay);
                ++reviewLoopTimes;
            }else{
                break;
            }
        }
        await EnsureWeAreDone(true);
    } else {
        options.log("Account have already unlocked the event")
    }
    callback();

    function vote(token, voteid, nominatedid, source) {
        return new Promise(function (resolve) {
            RequestStore.get({
                url: 'https://api.steampowered.com/ISteamAwardsService/Nominate/v1?access_token='+token+'&origin=https:%2F%2Fstore.steampowered.com&input_json=%7B%22category_id%22:'+voteid+',%22nominated_id%22:'+nominatedid+',%22source%22:'+source+'%7D',
                headers: {
                    'Origin': 'https://store.steampowered.com',
                    'Accept': '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Referer': 'https://store.steampowered.com/steamawards/nominations'

                }
            }, function (error, response, body) {
                try {
                    var status = JSON.parse(body); // if json, then it shoud be valid
                    
                } catch (error) {
                    options.logError(body);
                }
                resolve();
            })
        })
    }
    function ActivateGame(subid) {
        return new Promise(function (resolve) {
            RequestStore.post({
                url: "https://store.steampowered.com/checkout/addfreelicense/",
                form: {
                    action: 'add_to_cart',
                    subid: subid,
                    sessionid: SessionID
                }
            }, function (error, response, body) {
                resolve();
            })
        })

    }

    function EnsureWeAreDone(showMessage = false) {
        return new Promise(function (resolve) {
            RequestStore.get('https://store.steampowered.com/steamawards/nominations?snr=1_5_9_', function (error, response, html) {
                try {
                    var $ = cheerio.load(html);
                    var status = JSON.parse($("#application_config").attr("data-steam_awards_config"));
                    var bagdeStatus = status.badge_progress.quests;
                    if (bagdeStatus.filter(x => x.completed == 0).length > 0) {
                        if (showMessage) {
                            //it did not complete all
                            options.log(bagdeStatus.filter(x => x.completed == 1).length + " task done, out of 4")
                            options.log("tasks: (1:"+(bagdeStatus[0].completed? "done": "not done")+") (2:"+(bagdeStatus[1].completed? "done": "not done")+") (3:"+(bagdeStatus[2].completed? "done": "not done")+") (4:"+(bagdeStatus[3].completed? "done": "not done")+")")
                        }
                        resolve({list: bagdeStatus, status: false});
                        return;
                    } else {
                        resolve({list: bagdeStatus, status: true});
                        return;
                    }
                }
                catch{

                }
            });
        });

    }

    //make a Review 
    function Make(steamID, appid) {
        return new Promise(function (resolve) {
            var url = 'https://store.steampowered.com/friends/recommendgame';
            var form = {
                appid: appid,
                comment: "Great game!",
                disable_comments: 1,
                is_public: false,
                language: "english",
                rated_up: true,
                received_compensation: 0,
                sessionid: SessionID,
                steamworksappid: appid
            }

            RequestStore.post({
                url: url,
                form: form
            }, async function (error, response, body) {
                var ss = JSON.parse(body)
                if(!ss.success){
                    if(ss.strError.includes("You need to have used this product for at least 5 minutes befor")){
                        options.log("account need play time to be able to make a recommendgame, it will not play for 5 min!, error:", ss.strError)
                        steamClient.gamesPlayed([{ game_id: appToPlay }]);
                        await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 5)); // then we need more play time to be able to create the recommendgame
                    }else{
                        options.log("was not able to create recommendgame, error:", ss.strError)
                    }
                    resolve()
                    return;
                }else{
                    options.log("created");
                    setTimeout(async function () {
                        await removeMake(steamID, appid)
                        resolve();
                    }, 2000);
                }
            });
        });
    }
    //remove a Review 
    function removeMake(steamID, appid) {
        return new Promise(function (resolve) {
            RequestCommunity.post({
                url: 'https://steamcommunity.com/profiles/' + steamID + '/recommended/',
                form: {
                    action: "delete",
                    sessionid: SessionID,
                    appid: appid
                }
            }, function (er, re, bo) {
                options.log("fjerenet");
                resolve();
            })
        })
    }
    function GetToken() {
        return new Promise(function (resolve, reject) {
            RequestStore.get('https://store.steampowered.com/steamawards/nominations?snr=1_5_9_', function (error, response, html) {
                try {
                    var $ = cheerio.load(html);
                    var authwgtoken = JSON.parse($("#application_config").attr("data-store_user_config"));
                    if(authwgtoken.webapi_token){
                        resolve(authwgtoken.webapi_token);
                        return;
                    }else{
                        logError("error did not get the web token");
                        reject();
                    }
                } catch (error) {
                    logError("error:", html);
                    reject();
                }
            });
        })
    }
};



