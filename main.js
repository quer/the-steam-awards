const config = require('./config');
const Steam = require('steam');
const SteamTotp = require('steam-totp');
const SteamWebLogOn = require('steam-weblogon');
const cheerio = require('cheerio');
const request = require('request');

function loop(index) {
	if(config.length <= index ){
		return;
	}
	var auth = config[index];
	var steamClient = new Steam.SteamClient(),
	    steamUser = new Steam.SteamUser(steamClient),
	    steamFriends = new Steam.SteamFriends(steamClient),
		steamWebLogOn = new SteamWebLogOn(steamClient, steamUser);
	steamClient.connect();
	steamClient.on('connected', function() {
		console.log("Connected to Steam.");
		steamUser.logOn({
			account_name: auth.steam_user,
			password: auth.steam_pass,
			//auth_code: "NBMD8"
			two_factor_code: SteamTotp.getAuthCode(auth.sharedSecret)
		});
	});
	
	steamClient.on('logOnResponse', function onSteamLogOn(logonResp) {
		console.log("logOnResponse");
		console.log("logOnResponse", logonResp.eresult);
	    if (logonResp.eresult == Steam.EResult.OK) {
	    	console.log("logOnResponse OK");
	        steamFriends.setPersonaState(Steam.EPersonaState.Busy);
	        websession(steamWebLogOn, steamClient, steamUser, function (_request, sessionID) {
	        	vote(1, 271590, _request, sessionID, "", function () {
	        		vote(2, 570, _request, sessionID, "", function () {
	        			steamUser.gamesPlayed({games_played:[{game_id:570}]});
	        			vote(3, 578080, _request, sessionID, "", function () {
	        				vote(4, 730, _request, sessionID, "", function () {
	        					vote(5, 230410, _request, sessionID, "", function () {
	        						vote(6, 440, _request, sessionID, "", function () {
						        		vote(7, 359550, _request, sessionID, "", function () {
							        		vote(8, 624090, _request, sessionID, "", function () {
								        		vote(9, 252950, _request, sessionID, "", function () {
									        		vote(10, 346110, _request, sessionID, "", function () {
										        		vote(11, 8930, _request, sessionID, "", function () {
											        		vote(12, 4000, _request, sessionID, "", function () {
											        			vote(13, 289070, _request, sessionID, "Game for the party", function () {
											        				steamClient.disconnect();
											        				loop(++index);
										        				})
											        		})
											        	})
										        	})
									        	})
							        		})
							        	})
					        		})
					        	})
				        	})
			        	})
		        	})
	        	})
	        })
	    }
	});
	steamClient.on('loggedOff', function onSteamLogOff(eresult) {
	    console.log("Logged off from Steam.");
	});

	steamClient.on('error', function onSteamError(error) {
	    console.log("Connection closed by server - ", error);
	});


// end 
}

loop(0);
function websession(steamWebLogOn, steamClient, steamUser, callback) {	
	var _requestCommunity;
	var _j;
	var defaultTimeout = 30000;
	var communityURL = 'https://store.steampowered.com';
	console.log("websession start");
	steamWebLogOn.webLogOn(function(sessionID, newCookie) {
		console.log(sessionID, newCookie);
		console.log(defaultTimeout);
		var requestWrapper = request.defaults({
			timeout: defaultTimeout
		});
        _j = request.jar();

		_requestCommunity = requestWrapper.defaults({
			jar: _j
		});
		newCookie.forEach(function(name) {
			_j.setCookie(request.cookie(name), communityURL);
		});
		console.log("websession done");
		callback(_requestCommunity, sessionID);
	});
}


function vote(categoryid, appid, _request, sessionID, writein, callback) {
	console.log("vote - " +categoryid + " - start");
	_request.post({
		url: 'http://store.steampowered.com/promotion/nominategame',
		form:{
			sessionid: sessionID,
			appid: appid,
			categoryid: categoryid,
			writein: writein
		}
	}, function (error, response, body) {
		console.log(error);
		//console.log(response);
		console.log(body);
		console.log("vote - " +categoryid + " - end");
		setTimeout(function(){
			callback();
		}, 2000);
	});
}