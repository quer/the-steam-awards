var cheerio = require('cheerio');
var subidToActive = null; // make "null" if you know a app that the account can play, that have been voted on,
var appToPlay = 440;
var AppidToVote = {
    "72": { appid: 1938090, source: 3 },
    "73": { appid: 2215130, source: 1 }, //vote skip
    "74": { appid: 440, source: 3 },
    "75": { appid: 973230, source: 3 },
    "76": { appid: 377300, source: 3 },
    "77": { appid: 1336490, source: 3 },
    "78": { appid: 799600, source: 3 },
    "79": { appid: 261550, source: 3 },
    "80": { appid: 1273400, source: 3 },
    "81": { appid: 2218020, source: 3 },
    "82": { appid: 2096610, source: 1 }, //vote skip
};
module.exports = async function (steamClient, RequestCommunity, RequestStore, SessionID, options, callback) {
    if (await EnsureWeAreDone()) {
        for (let i = 72; i < 83; i++) {
            var voteObj = AppidToVote[i];
            await vote(i, voteObj.appid, voteObj.source);
        }
        if (subidToActive != null) {
            await ActivateGame(subidToActive);
        }
        options.steamUser.gamesPlayed([{ game_id: appToPlay }]);
        await new Promise(resolve => setTimeout(resolve, 1000 * 60)); 
        while (!HaveGotPlayAGame()) { 
            await new Promise(resolve => setTimeout(resolve, 1000 * 60)); // check each 1 min. if is unlocked

        }
        options.steamUser.gamesPlayed([]);
        var reviewLoopTimes = 0;
        while (reviewLoopTimes < 7) {
            if(!await HaveMadeReview()){
                options.steamUser.gamesPlayed([{ game_id: appToPlay }]); // start the game to get more play time
                await new Promise(resolve => setTimeout(resolve, 1000 * 60));
                options.steamUser.gamesPlayed([]);
                await Make(steamClient.steamID, appToPlay);
                ++reviewLoopTimes;
            }else{
                break;
            }
        }
        await EnsureWeAreDone();
    } else {
        options.log("Account have already unlocked the event")
    }
    callback();

    function vote(voteid, appid, source) {
        return new Promise(function (resolve) {
            RequestStore.post({
                url: 'https://store.steampowered.com/steamawards/nominategame',
                form: {
                    sessionid: SessionID,
                    categoryid: voteid,
                    nominatedid: appid,
                    source: source,
                },
                headers: {
                    'Origin': 'https://store.steampowered.com',
                    'Accept': '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Referer': 'https://store.steampowered.com/steamawards/nominations'

                }
            }, function (error, response, body) {
                try {
                    var status = JSON.parse(body);
                    if (status.success != 1) {
                        throw body;
                    }
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
            RequestStore.get('https://store.steampowered.com/steamawards/nominations', function (error, response, body) {
                var $ = cheerio.load(body);
                if ($(".badge_preview.level_4.current").length <= 0) {
                    if (showMessage) {
                        //it did not complete all
                        //let see why
                        var rowsMissing = [];
                        var nomination_rows = $(".nomination_row");
                        for (let i = 0; i < nomination_rows.length; i++) {
                            const nomination_row = nomination_rows[i];
                            var rowjquery = $(nomination_row);
                            if (!rowjquery.hasClass('has_nomination')) {
                                rowsMissing.push(i + 1); // to show human read row number
                            }
                        }
                        var onlyLookAtPlayGameAndReviewTaskStatus = $($(".badge_tasks_right")[0]).find(".badge_task");
                        var haveDonePlaygame = onlyLookAtPlayGameAndReviewTaskStatus[0] && $(onlyLookAtPlayGameAndReviewTaskStatus[0]).find(".nominate_check").length > 0 ? "true" : "false";
                        var haveDoneReview = onlyLookAtPlayGameAndReviewTaskStatus[1] && $(onlyLookAtPlayGameAndReviewTaskStatus[1]).find(".nominate_check").length > 0 ? "true" : "false";
                        options.log(" did not complete the flow. status: ");
                        console.table([
                            { message: "missing nominations rows", status: rowsMissing.join(",") },
                            { message: "have played the game", status: haveDonePlaygame },
                            { message: "have create a review for the game", status: haveDoneReview },
                        ]);
                    }
                    resolve(false);
                    return;
                } else {
                    resolve(true);
                    return;
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
            }, function (error, response, body) {
                //console.log(error);
                console.log(body);
                console.log("created");
                setTimeout(function () {
                    removeMake(steamID, appid, resolve)
                }, 2000);
            });
        });
    }
    //remove a Review 
    function removeMake(steamID, appid, callback) {
        RequestCommunity.post({
            url: 'https://steamcommunity.com/profiles/' + steamID + '/recommended/',
            form: {
                action: "delete",
                sessionid: SessionID,
                appid: appid
            }
        }, function (er, re, bo) {
            console.log("fjerenet");
            callback();
        })
    }
    function HaveGotPlayAGame() {
        return new Promise(function (resolve) {
            RequestStore.get('https://store.steampowered.com/steamawards/nominations', function (error, response, body) {
                var $ = cheerio.load(body);
                setTimeout(function(){
                    resolve($($(".badge_tasks_right .badge_task")[0]).find(".nominate_check").length > 0);
                }, 2000);
            });
        });
    }
    function HaveMadeReview() {
        return new Promise(function (resolve) {
            RequestStore.get('https://store.steampowered.com/steamawards/nominations', function (error, response, body) {
                var $ = cheerio.load(body);
                resolve($($(".badge_tasks_left .badge_task")[1]).find(".nominate_check").length > 0);
            });
        });
    }
};



