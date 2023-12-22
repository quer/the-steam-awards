var cheerio = require('cheerio');
var saleID = 2640290;
module.exports = async function (steamClient, RequestCommunity, RequestStore, SessionID, options, callback) {
    var event = await getEventInfo();
    if(event.event.user_votes.length < 11){
        for (let i = 0; i < event.event.definitions.votes.length; i++) {
            const voteObj = event.event.definitions.votes[i];
            if(event.event.user_votes.filter(x => x.voteid == voteObj.voteid).length > 0){
                continue; // then we allready vote for this cat!
            }
            var toBevotedOn =  voteObj["app_discounts"][Math.floor(Math.random() * voteObj["app_discounts"].length)];
            await vote(event.token, voteObj.voteid, toBevotedOn.appid, saleID);
        }
        
        var ensureWereAreDone = await getEventInfo();
        if(ensureWereAreDone.event.user_votes.length != 11){
            options.log("Account was not done! and need to be runned agirn")
        }
    }else{
        options.log("Account allready done!")
    }

    callback();

    function vote(token, voteid, appid, sale_appid) {
        return new Promise(function (resolve) {
            RequestStore.post({
                url: 'https://api.steampowered.com/IStoreSalesService/SetVote/v1?access_token=' + token,
                form: {
                    input_json: `{"voteid":${voteid},"appid":${appid},"sale_appid":${sale_appid}}`
                },
                headers: {
                    'Origin': 'https://store.steampowered.com',
                    'Accept': '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Referer': 'https://store.steampowered.com/steamawards'

                }
            }, function (error, response, body) {
                resolve();
            })
        })
    }

    function getEventInfo() {
        return new Promise(function (resolve, reject) {
            RequestStore.get('https://store.steampowered.com/steamawards', function (error, response, body) {
                var $ = cheerio.load(body);
                try {
                    var data = JSON.parse($("#application_config").attr("data-steam_awards_config"));
                    var authwgtoken = JSON.parse($("#application_config").attr("data-store_user_config"));
                    if(authwgtoken.webapi_token){
                        resolve({event: data, token: authwgtoken.webapi_token});
                        return;
                    }else{
                        options.logError("error did not get the web token");
                        reject();
                        return;
                    }
                } catch (error) {
                    options.logError(body);
                    options.logError(error);
                    options.logError("error did not get the web token");
                    reject(error);
                }
            
            });
        });
    }
};