const core = require('./lib/core');
core.Setting.AuthFieldNameUsername = "username";
core.Setting.AuthFieldNamePassword = "password";
core.Setting.Logging.SaveLogMode = core.Enums.logging.all;
core.Setting.RunningMode.Mode = core.Enums.RunningMode.cluster;
core.Setting.RunningMode.clusterSize = 4;

var modules = [];
//modules.push('events/salequeue');
//modules.push('events/FreeDailySticker');
//modules.push('profileComment');
//modules.push('Wishlist_AddGame');
//modules.push('GameRecommend_Add');
modules.push('SharedFile_Comment');



//core.RunAllBots(modules)
core.RunIndexSpecificBot([0], modules)
.then(function () {
}).catch(function (error) {
	console.error("Somefing happend!");
	console.error(error);
}).finally(function () {
	process.exit();
})
