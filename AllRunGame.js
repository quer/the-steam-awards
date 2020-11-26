const config = require('./config');
const Steam = require('steam');
const SteamTotp = require('steam-totp');
const SteamWebLogOn = require('steam-weblogon');
const request = require('./request');
const cheerio = require('cheerio');
Steam.servers = require('./steamServer');
var promiseList = [];
var appidToGame = 730;
for (let i = 0; i < config.length; i++) {
    promiseList.push(startBot(i, appidToGame));
}
Promise.all(promiseList).then(() => {
    console.log("all are running");
  });
function startBot(index, appid)
{
	return new Promise(function (resolve) {
        var auth = config[index];
        var steamClient = new Steam.SteamClient(),
            steamUser = new Steam.SteamUser(steamClient),
            steamFriends = new Steam.SteamFriends(steamClient),
            steamWebLogOn = new SteamWebLogOn(steamClient, steamUser);
        steamClient.connect();
        steamClient.on('servers', function(server) {
        });
        console.log(auth.username);
        steamClient.on('connected', function() {
            steamUser.logOn({
                account_name: auth.username,
                password: auth.password,
                two_factor_code: SteamTotp.getAuthCode(auth.sharedSecret)
            });
        });
        
        steamClient.on('logOnResponse', function onSteamLogOn(logonResp) {
            if (logonResp.eresult == Steam.EResult.OK) {
                
                steamFriends.setPersonaState(Steam.EPersonaState.Busy);
                steamUser.gamesPlayed([{ game_id: appid }]);
                var interval = null;
                websession(steamWebLogOn, steamClient, steamUser, function (_requestCommunity, _requestStore, sessionID) {
                    interval = setInterval(async function () {
                        try {
                            await EnsureWeAreDone(_requestStore);
                            //we are done.. and just exist account
                            SayBotIsDone();
                            clearInterval(interval);
                            steamClient.disconnect();
                        } catch (error) {
                            //keep goind
                        }
                    }, 1000 * 30) // check each 30 sec
                });
                SayBotIsLive();

                resolve(steamClient);
            }
        });
        steamClient.on('loggedOff', function onSteamLogOff(eresult) {
        });

        steamClient.on('error', function onSteamError(error) {
            steamClient.connect();
        });
    });
}
var liveBots = 0;
function SayBotIsLive() {
    liveBots = liveBots + 1;
    console.log("running bots :" + liveBots + "/" + promiseList.length);
}
var botsDone = 0;
function SayBotIsDone() {
    botsDone = botsDone + 1;
    console.log("bots Done :" + botsDone + "/" + promiseList.length);
}
function websession(steamWebLogOn, steamClient, steamUser, callback) {	
	steamWebLogOn.webLogOn(function(sessionID, newCookie) {
		var _requestCommunity = new request('https://steamcommunity.com');
		var _requestStore = new request('https://store.steampowered.com');
		newCookie.forEach(function(name) {
			_requestCommunity.setCookie(name);
			_requestStore.setCookie(name);
		});
		callback(_requestCommunity, _requestStore, sessionID);
	});
}

function EnsureWeAreDone(_requestStore) {
	return new Promise(function (resolve, reject) {
		_requestStore.get('https://store.steampowered.com/steamawards/nominations', function (error, response, body) {
			var $ = cheerio.load(body);
            var onlyLookAtPlayGameAndReviewTaskStatus = $($(".badge_tasks_right")[0]).find(".badge_task");
            if(onlyLookAtPlayGameAndReviewTaskStatus[0] && $(onlyLookAtPlayGameAndReviewTaskStatus[0]).find(".nominate_check").length){
                resolve();
				return;
			}else{
				reject();
				return;
			}
		});
	});
	
}