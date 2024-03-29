var cheerio = require('cheerio');
module.exports = function(steamClient, _requestCommunity, _requestStore, sessionID, options, callback){
	vote(1, 620980, _requestStore, sessionID, 3, function () {
		vote(2, 954740, _requestStore, sessionID, 3, function () {
			vote(3, 730, _requestStore, sessionID, 3, function () {
				vote(4, 1165670, _requestStore, sessionID, 3, function () {
					vote(5, 813780, _requestStore, sessionID, 3, function () {
						vote(6, 985430, _requestStore, sessionID, 3, function () {
							vote(7, 746110, _requestStore, sessionID, 3, function () {
								vote(8, 1172380, _requestStore, sessionID, 3, function () {
									options.steamUser.gamesPlayed({games_played:[{game_id:570}]});
									setTimeout(function(){	
										Make(_requestCommunity, _requestStore, sessionID, steamClient.steamID, function(){
											console.log("done!");
											setTimeout(function(){	
												callback();
											}, 500);
										})
									}, 500);
								})
							})
						})
					})
				})
			})
		})
	})
};

function vote(categoryid, appid, _request, sessionID, writein, callback) {
	console.log("vote - " +categoryid + " - start");
	_request.post({
		url: 'https://store.steampowered.com/steamawards/nominategame',
		form:{
			sessionid: sessionID,
			nominatedid: appid,
			categoryid: categoryid,
			source: 3
		},
		headers: {
			'Origin': 'https://store.steampowered.com',
			'Accept': '*/*',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'Referer': 'https://store.steampowered.com/steamawards/category/'+categoryid

		}
	}, function (error, response, body) {
		//console.log(error);
		//console.log(response);
		//console.log(body);
		console.log("vote - " +categoryid + " - end");
		setTimeout(function(){
			callback();
		}, 500);
	});
}

function Make(_requestCommunity, _requestStore, sessionID, steamID, callback) {
	var url = 'https://store.steampowered.com/friends/recommendgame';
	var form = {
		appid: 730,
		comment: "Great game!",
		disable_comments: 1,
		is_public: false,
		language: "english",
		rated_up: true,
		received_compensation: 0,
		sessionid: sessionID,
		steamworksappid: 730
	}

	_requestStore.post({
		url: url,
		form: form
	}, function (error, response, body) {
		//console.log(error);
		//console.log(body);
		console.log("created");
		setTimeout(function(){
			removeMake(_requestCommunity, _requestStore, sessionID, steamID, callback)
		}, 2000);
	});
}
function removeMake(_requestCommunity, _requestStore, sessionID, steamID, callback) {
	_requestCommunity.post({
		url: 'https://steamcommunity.com/profiles/'+steamID+'/recommended/',
		form: {
			action: "delete",
			sessionid: sessionID,
			appid: 730
		}
	}, function (er, re,  bo) {
		console.log("fjerenet");
		//console.log(bo);
		callback();
	})
}
