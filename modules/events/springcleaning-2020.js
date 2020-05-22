var cheerio = require('cheerio');
module.exports = function(steamClient, RequestCommunity, RequestStore, SessionID, options, callback){
    RequestStore.post({
        url: "https://store.steampowered.com/springcleaning/ajaxoptintoevent", 
            form: {
                sessionid: SessionID
            }
        }, function () {
            RequestStore.get("https://store.steampowered.com/springcleaning", function(error, response, body) {
                var appsObjToRun = [];
                var appsToRun = [];
                var $ = cheerio.load(body);
                var games = $("[data-sg-appid]");
                for (let i = 0; i < games.length; i++) {
                    const game = $(games[i]);
                    var appid = game.attr("data-sg-appid");
                    appsObjToRun.push({"game_id": parseInt(appid, 10)});
                    appsToRun.push(parseInt(appid, 10));
                }
                //will activate the missing games, to the user
                options.steamUser.requestFreeLicense(appsToRun);

                options.steamUser.gamesPlayed(appsObjToRun);
                setTimeout(function () {
                    console.log(options.accountPretty + " - done");
                    callback();
                }, 3000); 
            });
        })

    
}