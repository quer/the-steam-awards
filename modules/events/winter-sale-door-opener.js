module.exports = function(steamClient, _requestCommunity, _requestStore, sessionID, options, callback){
	openDoor(_requestCommunity, _requestStore, 0, sessionID, function(){
		openDoor(_requestCommunity, _requestStore, 1, sessionID, function(){
			openDoor(_requestCommunity, _requestStore, 2, sessionID, function(){
				openDoor(_requestCommunity, _requestStore, 3, sessionID, function(){
					openDoor(_requestCommunity, _requestStore, 4, sessionID, function(){
						openDoor(_requestCommunity, _requestStore, 5, sessionID, function(){
							openDoor(_requestCommunity, _requestStore, 6, sessionID, function(){
								openDoor(_requestCommunity, _requestStore, 7, sessionID, function(){
									openDoor(_requestCommunity, _requestStore, 8, sessionID, function(){
										openDoor(_requestCommunity, _requestStore, 9, sessionID, function(){
											openDoor(_requestCommunity, _requestStore, 10, sessionID, function(){
												openDoor(_requestCommunity, _requestStore, 11, sessionID, function(){
													setTimeout(function(){	
														callback();
													}, 500);
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
}
function openDoor(_requestCommunity, _requestStore, door, sessionID, callback){
    _requestStore.post({
		url: 'https://store.steampowered.com/promotion/opencottagedoorajax',
		form:{
			sessionid: sessionID,
			door_index: door,
			t: new Date().toISOString(),
			open_door: true
        }
	}, function (error, response, body) {
		console.log(error);
		//console.log(response);
		console.log(body);
		console.log("door - " +door + " - end");
		setTimeout(function(){
			callback();
		}, 500);
	});
}