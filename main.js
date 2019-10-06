const config = require('./config');
const Steam = require('steam');
const SteamTotp = require('steam-totp');
const SteamWebLogOn = require('steam-weblogon');
const request = require('request');
Steam.servers = [{host:'162.254.197.180', port: 27017}];
var modules = [];
//add moduels order
//modules.push(require('./modules/chanceProfileImage'));
//modules.push(require('./modules/joinGroup'));
//modules.push(require('./modules/chanceAccountSettings'));
modules.push(require('./modules/guideVoteLikeShare'));
function loop(index) {
	runBot(index, loop);
    // end 
}

loop(0); // run all
/*runBot(14, function () {
	console.log("all done!")
	return;
});*/
function runBot(index, callback) {
	if(config.length <= index ){
		console.log("all done!")
		return;
	}
	var auth = config[index];
	var steamClient = new Steam.SteamClient(),
	    steamUser = new Steam.SteamUser(steamClient),
	    steamFriends = new Steam.SteamFriends(steamClient),
		steamWebLogOn = new SteamWebLogOn(steamClient, steamUser);
	steamClient.connect();
	steamClient.on('servers', function(server) {
		//console.log(server);
	});
	console.log(auth.steam_user);
	steamClient.on('connected', function() {
		console.log("Connected to Steam.");
		steamUser.logOn({
			account_name: auth.steam_user,
			password: auth.steam_pass,
			two_factor_code: SteamTotp.getAuthCode(auth.sharedSecret)
		});
	});
	
	steamClient.on('logOnResponse', function onSteamLogOn(logonResp) {
		//console.log("logOnResponse");
		//console.log("logOnResponse", logonResp.eresult);
	    if (logonResp.eresult == Steam.EResult.OK) {
	    	//console.log("logOnResponse OK");
	        steamFriends.setPersonaState(Steam.EPersonaState.Busy);
	        websession(steamWebLogOn, steamClient, steamUser, function (_requestCommunity, _requestStore, sessionID) {
				var options = {
					Index: index,
					UserName: auth.steam_user,
					steamUser: steamUser,
					steamFriends: steamFriends
				}
                runModules(0, steamClient, _requestCommunity, _requestStore, sessionID, options, function () {
                    console.log("done!");
                    setTimeout(function(){	
						steamClient.disconnect();
						setTimeout(function () {
							callback(++index);
						}, 1500);
                    }, 500);
                });
	        });
	    }
	});
	steamClient.on('loggedOff', function onSteamLogOff(eresult) {
	    console.log("Logged off from Steam.");
	});

	steamClient.on('error', function onSteamError(error) {
		console.log("Connection closed by server - ", error);
		steamClient.connect();
	});
}

function websession(steamWebLogOn, steamClient, steamUser, callback) {	
	var _requestCommunity;
	var _j1;
	var _requestStore;
	var _j2;
	var defaultTimeout = 30000;
	var storeURL = 'https://store.steampowered.com';
	var communityURL = 'https://steamcommunity.com';
	console.log("websession start");
	steamWebLogOn.webLogOn(function(sessionID, newCookie) {
		//console.log(sessionID, newCookie);
		//console.log(defaultTimeout);
		var requestWrapper1 = request.defaults({
			timeout: defaultTimeout
		});
		var requestWrapper2 = request.defaults({
			timeout: defaultTimeout
		});
        _j1 = request.jar();
        _j2 = request.jar();

		_requestCommunity = requestWrapper1.defaults({jar: _j1});
		_requestStore = requestWrapper2.defaults({jar: _j2});
		newCookie.forEach(function(name) {
			_j1.setCookie(request.cookie(name), communityURL);
			_j2.setCookie(request.cookie(name), storeURL);
		});
		//console.log("websession done");
		callback(_requestCommunity, _requestStore, sessionID);
	});
}
function runModules(index, steamClient, _requestCommunity, _requestStore, sessionID, options, callback){
    if(index < modules.length){
        modules[index](steamClient, _requestCommunity, _requestStore, sessionID, options, function () {
            runModules(++index, steamClient, _requestCommunity, _requestStore, sessionID, options, callback);
        })
    }
    else
    {
        console.log("Modules done");
        callback();
    }
}