module.exports = function(steamClient, _requestCommunity, _requestStore, sessionID, options, callback){
	vote(1, 271590, _requestStore, sessionID, 3, function () {
		vote(2, 570, _requestStore, sessionID, 3, function () {
			vote(3, 578080, _requestStore, sessionID, 3, function () {
				vote(4, 4, _requestStore, sessionID, 4, function () {
					vote(5, 230410, _requestStore, sessionID, 3, function () {
						vote(6, 440, _requestStore, sessionID, 3, function () {
							vote(7, 359550, _requestStore, sessionID, 3, function () {
								vote(8, 730, _requestStore, sessionID, 3, function () {
									options.steamUser.gamesPlayed({games_played:[{game_id:570}]});
									Make(_requestCommunity, _requestStore, sessionID, function(){
										console.log("done!");
										setTimeout(function(){	
											callback();
										}, 500);
									})
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

function Make(_requestCommunity, _requestStore, sessionID, callback) {
	var url = 'https://store.steampowered.com/friends/recommendgame';
	var form = {
		appid: 570,
		comment: "Great game!",
		disable_comments: 1,
		is_public: false,
		language: "english",
		rated_up: true,
		received_compensation: 0,
		sessionid: sessionID,
		steamworksappid: 570
	}

	_requestStore.post({
		url: url,
		form: form
	}, function (error, response, body) {
		//console.log(error);
		//console.log(body);
		console.log("created");
		setTimeout(function(){
			_requestCommunity.post({
				url: 'http://steamcommunity.com/my/recommended/',
				form: {
					action: "delete",
					sessionid: sessionID,
					appid: 570
				}
			}, function (er, re,  bo) {
				console.log("fjerenet");
				callback();				
			})
		}, 2000);
	});
}
function removeMake(_requestCommunity, _requestStore, sessionID, callback) {
	_requestCommunity.post({
		url: 'http://steamcommunity.com/my/recommended/',
		form: {
			action: "delete",
			sessionid: sessionID,
			appid: 570
		}
	}, function (er, re,  bo) {
		console.log("fjerenet");
		//console.log(bo);
		callback();
	})
}