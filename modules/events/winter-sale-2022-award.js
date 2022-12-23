var cheerio = require('cheerio');
var AppidToVote = {
    "72": { appid: 1245620 },
    "73": { appid: 1659040 },
    "74": { appid: 1091500 },
    "75": { appid: 648800 },
    "76": { appid: 1817190 },
    "77": { appid: 1332010 },
    "78": { appid: 1245620 },
    "79": { appid: 1462040 },
    "80": { appid: 1659420 },
    "81": { appid: 920210 },
    "82": { appid: 1794680 }
};
module.exports = async function (steamClient, RequestCommunity, RequestStore, SessionID, options, callback) {
    if (!await AreWeAreDone()) {
        for (let i = 72; i < 83; i++) {
            var voteObj = AppidToVote[i];
            await vote(i, voteObj.appid);
        }
        if(!await AreWeAreDone()){
            options.log("did not vote for all. try rerun. ")
        };
    } else {
        options.log("Account have already unlocked all card in the event")
    }
    callback();

    function vote(voteid, appid) {
        return new Promise(function (resolve) {
            RequestStore.post({
                url: 'https://store.steampowered.com/salevote',
                form: {
                    sessionid: SessionID,
                    voteid: voteid,
                    appid: appid,
                    developerid: 0,
                },
                headers: {
                    'Origin': 'https://store.steampowered.com',
                    'Accept': '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Referer': 'https://store.steampowered.com/steamawards/nominations'

                }
            }, function (error, response, body) {
                var $ = cheerio.load(body);
                options.log($(".card_drop_info_breakafter").text());

                resolve();
            })
        })
    }

    function AreWeAreDone() {
        return new Promise(function (resolve) {
            RequestStore.get('https://store.steampowered.com/steamawards', function (error, response, body) {
                var $ = cheerio.load(body);
                var nomination_rows = $(".vote_category_bg");
                var compleated = 0;
                for (let i = 0; i < nomination_rows.length; i++) {
                    const nomination_row = nomination_rows[i];
                    var rowjquery = $(nomination_row);
                    if(rowjquery.find(".active_vote").length > 0){
                        ++compleated;
                    }
                }
                resolve(compleated == nomination_rows.length);
                return;
            
            });
        });
    }
};